import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => setProducts(data.slice(0, 8)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-14 text-white md:px-12">
        <h1 className="max-w-xl text-3xl font-bold md:text-4xl">
          Everything you need, delivered to your door
        </h1>
        <p className="mt-3 max-w-lg text-brand-50">
          A clean, simple shopping experience. Browse products, add to cart, and pay cash on
          delivery.
        </p>
        <Link to="/products" className="btn mt-6 bg-white text-brand-700 hover:bg-gray-100">
          Shop Now
        </Link>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-500">
            No products yet. Ask an admin to add some.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
