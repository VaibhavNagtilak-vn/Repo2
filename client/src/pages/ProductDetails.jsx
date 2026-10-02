import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { formatCurrency } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading product..." />;
  if (notFound || !product)
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/products" className="btn-primary mt-4">
          Back to Products
        </Link>
      </div>
    );

  const out = product.stock <= 0;
  const max = Math.max(product.stock, 1);

  function handleAdd() {
    addItem(product, qty);
    toast.success(`Added ${qty} × "${product.name}" to cart`);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="card overflow-hidden">
        <div className="aspect-square w-full bg-gray-100">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {product.category?.name && (
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {product.category.name}
          </span>
        )}
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-3xl font-semibold text-brand-600">
          {formatCurrency(product.price)}
        </p>
        <p className="mt-4 whitespace-pre-line text-gray-600">{product.description}</p>

        <p className={`mt-4 text-sm ${out ? "text-red-600" : "text-green-600"}`}>
          {out ? "Out of stock" : `${product.stock} in stock`}
        </p>

        {!out && (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-gray-600">Qty</span>
            <div className="flex items-center rounded-md border border-gray-300">
              <button
                type="button"
                className="px-3 py-1 text-lg"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                type="button"
                className="px-3 py-1 text-lg"
                onClick={() => setQty((q) => Math.min(max, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button type="button" className="btn-primary" onClick={handleAdd} disabled={out}>
            {out ? "Out of stock" : "Add to Cart"}
          </button>
          <button
            type="button"
            className="btn-outline"
            disabled={out}
            onClick={() => {
              handleAdd();
              navigate("/cart");
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
