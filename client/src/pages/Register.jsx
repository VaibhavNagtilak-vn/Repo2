import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  }

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Your name" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ];

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Register</h1>
        <p className="mt-1 text-sm text-gray-500">Create your customer account.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="label" htmlFor={f.name}>{f.label}</label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                className="input"
                value={form[f.name]}
                onChange={onChange}
                placeholder={f.placeholder}
              />
              {errors[f.name] && <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>}
            </div>
          ))}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
