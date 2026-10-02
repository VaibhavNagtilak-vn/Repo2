import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { formatCurrency, formatDate, STATUS_COLORS } from "../../utils/format.js";
import { useToast } from "../../context/ToastContext.jsx";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function OrderDetails() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  async function onStatusChange(status) {
    const prev = order.status;
    setOrder((o) => ({ ...o, status }));
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Order marked ${status}`);
    } catch (err) {
      setOrder((o) => ({ ...o, status: prev }));
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  }

  if (loading) return <Loader label="Loading order..." />;
  if (!order)
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/admin/orders" className="btn-primary mt-4">
          Back to Orders
        </Link>
      </div>
    );

  const a = order.shippingAddress;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/orders" className="text-sm text-brand-600 hover:underline">
            ← Back to Orders
          </Link>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h2>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <select
          className={`badge cursor-pointer border-0 text-sm ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}
          value={order.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <h3 className="font-medium text-gray-900">Items</h3>
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
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">Total (Cash on Delivery)</span>
            <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="font-medium text-gray-900">Customer</h3>
            <p className="mt-2 text-sm text-gray-700">{order.user?.name || "—"}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium text-gray-900">Shipping Address</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-800">{a.name}</p>
              <p>{a.phone}</p>
              <p>{a.address}</p>
              <p>
                {a.city} — {a.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
