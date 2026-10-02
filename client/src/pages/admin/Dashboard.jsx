import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/categories").then((r) => r.data.length).catch(() => 0),
      api.get("/products").then((r) => r.data.length).catch(() => 0),
      api.get("/admin/orders").then((r) => r.data.length).catch(() => 0),
    ])
      .then(([categories, products, orders]) => setStats({ categories, products, orders }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { label: "Categories", value: stats.categories, to: "/admin/categories" },
    { label: "Products", value: stats.products, to: "/admin/products" },
    { label: "Orders", value: stats.orders, to: "/admin/orders" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card p-5 transition hover:shadow-md">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{c.value}</p>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Use the sidebar to manage categories, products, and orders.
      </p>
    </div>
  );
}
