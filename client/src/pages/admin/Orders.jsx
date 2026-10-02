import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import DataTable from "../../components/admin/DataTable.jsx";
import Loader from "../../components/Loader.jsx";
import { formatCurrency, formatDate, STATUS_COLORS } from "../../utils/format.js";
import { useToast } from "../../context/ToastContext.jsx";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  function load() {
    setLoading(true);
    api
      .get("/admin/orders")
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function onStatusChange(order, status) {
    const prev = order.status;
    setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status } : o)));
    try {
      await api.patch(`/admin/orders/${order._id}/status`, { status });
      toast.success(`Order marked ${status}`);
    } catch (err) {
      setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status: prev } : o)));
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  }

  const columns = [
    { key: "id", label: "Order", render: (r) => `#${r._id.slice(-8)}` },
    { key: "customer", label: "Customer", render: (r) => r.user?.name || "—" },
    { key: "items", label: "Items", render: (r) => r.products.length },
    { key: "total", label: "Total", render: (r) => formatCurrency(r.totalAmount) },
    { key: "date", label: "Placed", render: (r) => formatDate(r.createdAt) },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <select
          className={`badge cursor-pointer border-0 ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-700"}`}
          value={r.status}
          onChange={(e) => onStatusChange(r, e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <Link to={`/admin/orders/${r._id}`} className="btn-outline !px-3 !py-1">
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={orders} emptyMessage="No orders yet" />
      )}
    </div>
  );
}
