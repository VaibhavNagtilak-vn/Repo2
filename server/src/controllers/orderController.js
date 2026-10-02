import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const ADDRESS_FIELDS = ["name", "phone", "address", "city", "pincode"];

export async function createOrder(req, res, next) {
  const { products, shippingAddress } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }
  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address is required" });
  }
  for (const f of ADDRESS_FIELDS) {
    if (!shippingAddress[f] || !String(shippingAddress[f]).trim()) {
      return res.status(400).json({ message: `Shipping ${f} is required` });
    }
  }

  // 1. Validate every item against current DB state and build priced snapshots.
  const items = [];
  let total = 0;
  for (const entry of products) {
    if (!entry || !mongoose.isValidObjectId(entry.product)) {
      return res.status(400).json({ message: "Invalid product id in order" });
    }
    const qty = Number(entry.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }
    const product = await Product.findById(entry.product);
    if (!product) {
      return res.status(400).json({ message: `Product not found: ${entry.product}` });
    }
    if (product.stock < qty) {
      return res
        .status(400)
        .json({ message: `Insufficient stock for ${product.name} (available: ${product.stock})` });
    }
    // Price is read from the DB, never trusted from the client.
    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
    });
    total += product.price * qty;
  }

  // 2. Reserve stock with guarded atomic decrements (works on standalone MongoDB,
  //    no replica-set transaction required). Track successes so we can roll back.
  const reserved = [];
  try {
    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount !== 1) {
        throw httpError(400, `Insufficient stock for ${item.name}, please retry`);
      }
      reserved.push(item);
    }

    // 3. Persist the order.
    const order = await Order.create({
      user: req.user.id,
      products: items,
      totalAmount: total,
      shippingAddress,
      status: "Pending",
    });

    const populated = await Order.findById(order._id)
      .populate("products.product", "name")
      .populate("user", "name email");
    return res.status(201).json({ order: populated });
  } catch (err) {
    // Roll back any stock we already reserved so we never leak inventory.
    for (const item of reserved) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }).catch(
        () => {}
      );
    }
    if (err.status) return res.status(err.status).json({ message: err.message });
    return next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

const ALLOWED_STATUS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}
