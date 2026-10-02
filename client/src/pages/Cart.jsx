import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatCurrency } from "../utils/format.js";
import EmptyState from "../components/EmptyState.jsx";

export default function Cart() {
  const { items, changeQuantity, removeItem, total, count } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse products and add something you like."
        action={
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        }
      />
    );
  }

  function onIncrease(item) {
    if (item.quantity >= item.stock) {
      toast.error(`Only ${item.stock} in stock for ${item.name}`);
      return;
    }
    changeQuantity(item.product, 1, item.stock);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-semibold text-gray-900">Cart ({count})</h1>
        {items.map((item) => (
          <div key={item.product} className="card flex gap-4 p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
              {item.image ? (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                  No img
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <Link to={`/products/${item.product}`} className="font-medium text-gray-900 hover:text-brand-600">
                  {item.name}
                </Link>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => removeItem(item.product)}
                >
                  Remove
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(item.price)} each</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-md border border-gray-300">
                  <button
                    type="button"
                    className="px-3 py-1 text-lg"
                    onClick={() => changeQuantity(item.product, -1, item.stock)}
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{item.quantity}</span>
                  <button type="button" className="px-3 py-1 text-lg" onClick={() => onIncrease(item)}>
                    +
                  </button>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="card sticky top-24 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Items ({count})</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className="text-green-600">Cash on Delivery</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button type="button" className="btn-primary mt-4 w-full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
