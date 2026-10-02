import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}`);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to your account.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" value={form.email} onChange={onChange} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" value={form.password} onChange={onChange} placeholder="••••••" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          No account?{" "}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
