import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, product.stock);
        return prev.map((i) =>
          i.product === product._id ? { ...i, quantity: nextQty } : i
        );
      }
      const bounded = Math.min(qty, product.stock);
      if (bounded <= 0) return prev;
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: bounded,
        },
      ];
    });
  }

  function changeQuantity(id, delta, stock) {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.product !== id) return i;
          const max = stock ?? i.stock;
          const next = Math.min(Math.max(i.quantity + delta, 1), max);
          return { ...i, quantity: next, stock: max };
        })
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.product !== id));
  }

  function clear() {
    setItems([]);
  }

  const { count, total } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        count: acc.count + i.quantity,
        total: acc.total + i.price * i.quantity,
      }),
      { count: 0, total: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, changeQuantity, removeItem, clear, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
