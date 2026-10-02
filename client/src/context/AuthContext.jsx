import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  const user = auth?.user || null;
  const isAdmin = user?.role === "admin";

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth({ token: data.token, user: data.user });
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      setAuth({ token: data.token, user: data.user });
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
