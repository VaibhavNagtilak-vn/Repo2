import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export async function getProducts(req, res, next) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && mongoose.isValidObjectId(category)) {
      filter.category = category;
    } else if (category) {
      // allow filtering by category name
      const cat = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, "i") },
      });
      filter.category = cat ? cat._id : new mongoose.Types.ObjectId();
    }

    if (search) {
      const rx = new RegExp(search.trim(), "i");
      filter.$or = [{ name: rx }, { description: rx }];
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function validateProductBody(body, res) {
  const { name, description, price, category, stock } = body;
  if (!name || !description || price === undefined || !category || stock === undefined) {
    res.status(400).json({ message: "All product fields are required" });
    return false;
  }
  if (Number(price) <= 0) {
    res.status(400).json({ message: "Price must be greater than zero" });
    return false;
  }
  if (Number(stock) < 0) {
    res.status(400).json({ message: "Stock cannot be negative" });
    return false;
  }
  if (!mongoose.isValidObjectId(category)) {
    res.status(400).json({ message: "Invalid category" });
    return false;
  }
  const catExists = await Category.exists({ _id: category });
  if (!catExists) {
    res.status(400).json({ message: "Category does not exist" });
    return false;
  }
  return true;
}

export async function createProduct(req, res, next) {
  try {
    if (!(await validateProductBody(req.body, res))) return;
    const product = await Product.create(req.body);
    const populated = await Product.findById(product._id).populate("category", "name");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!(await validateProductBody({ ...product.toObject(), ...req.body }, res))) return;

    const { name, description, price, image, category, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    const populated = await Product.findById(product._id).populate("category", "name");
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}
