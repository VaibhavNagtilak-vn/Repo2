import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatCurrency, formatDate, STATUS_COLORS } from "../utils/format.js";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="When you place an order, it will show up here."
        action={
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Order</span> #{order._id.slice(-8)}
              <span className="mx-2">•</span>
              {formatDate(order.createdAt)}
            </div>
            <span className={`badge ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
              {order.status}
            </span>
          </div>

          <ul className="mt-3 space-y-3">
            {order.products.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-300">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-500">Total (COD)</span>
            <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
