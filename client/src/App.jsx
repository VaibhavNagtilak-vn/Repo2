import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyOrders from "./pages/MyOrders.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Categories from "./pages/admin/Categories.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import Orders from "./pages/admin/Orders.jsx";
import OrderDetails from "./pages/admin/OrderDetails.jsx";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        {/* Admin area (sidebar layout, admin-only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>

        {/* Public / customer area */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
