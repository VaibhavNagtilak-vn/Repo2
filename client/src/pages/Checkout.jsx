import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatCurrency } from "../utils/format.js";
import EmptyState from "../components/EmptyState.jsx";

const FIELDS = ["name", "phone", "address", "city", "pincode"];

export default function Checkout() {
  const { items, total, count, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to checkout"
        message="Your cart is empty."
        action={
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        }
      />
    );
  }

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    for (const f of FIELDS) {
      if (!form[f] || !form[f].trim()) next[f] = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    try {
      await api.post("/orders", {
        products: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: form,
      });
      clear();
      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={placeOrder} className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
        <div className="card space-y-4 p-4">
          <h2 className="font-medium text-gray-900">Shipping Address</h2>
          {FIELDS.map((f) => (
            <div key={f}>
              <label className="label capitalize" htmlFor={f}>
                {f}
              </label>
              <input
                id={f}
                name={f}
                className="input"
                value={form[f]}
                onChange={onChange}
                placeholder={f === "phone" ? "10-digit mobile" : f}
              />
              {errors[f] && <p className="mt-1 text-xs text-red-600">{errors[f]}</p>}
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h2 className="font-medium text-gray-900">Payment Method</h2>
          <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked readOnly className="text-brand-600" />
            Cash on Delivery
          </label>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={placing}>
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </form>

      <div className="lg:col-span-1">
        <div className="card sticky top-24 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Order ({count})</h2>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={i.product} className="flex justify-between text-sm text-gray-600">
                <span className="line-clamp-1">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatCurrency(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Final total is confirmed by the server using current prices.
          </p>
        </div>
      </div>
    </div>
  );
}
