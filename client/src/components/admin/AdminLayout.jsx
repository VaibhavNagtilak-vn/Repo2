import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    toast.info("Logged out");
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-brand-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } w-full bg-gray-800 p-4 md:block md:w-64 md:shrink-0`}
      >
        <div className="mb-6 text-lg font-bold text-white">
          Admin<span className="text-brand-500">Panel</span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-gray-700 pt-4">
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            ← View Store
          </NavLink>
          <button type="button" onClick={handleLogout} className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Logout ({user?.name})
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-6">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <button
            type="button"
            className="text-gray-600 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
