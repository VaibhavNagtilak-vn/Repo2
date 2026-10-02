import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    toast.info("Logged out");
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? "text-brand-600" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-gray-900">
          Mini<span className="text-brand-600">Shop</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          {user && (
            <NavLink to="/my-orders" className={linkClass}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button type="button" className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            className="text-gray-600 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-gray-100 px-4 py-2 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" className={linkClass} onClick={() => setOpen(false)}>
              Products
            </NavLink>
            {user && (
              <NavLink to="/my-orders" className={linkClass} onClick={() => setOpen(false)}>
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
                Admin
              </NavLink>
            )}
            {user ? (
              <button
                type="button"
                className="btn-outline mt-2 w-full"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout ({user.name})
              </button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" className="btn-outline flex-1" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
