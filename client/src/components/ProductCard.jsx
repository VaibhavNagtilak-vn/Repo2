import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();
  const out = product.stock <= 0;

  function handleAdd() {
    addItem(product, 1);
    toast.success(`Added "${product.name}" to cart`);
  }

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {product.category?.name && (
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {product.category.name}
          </span>
        )}
        <Link to={`/products/${product._id}`}>
          <h3 className="mt-1 line-clamp-1 font-medium text-gray-900 hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {formatCurrency(product.price)}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {out ? "Out of stock" : `${product.stock} in stock`}
        </p>
        <button
          type="button"
          className="btn-primary mt-4 w-full"
          onClick={handleAdd}
          disabled={out}
        >
          {out ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
