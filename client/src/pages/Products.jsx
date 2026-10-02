import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("search") || "";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = {};
    if (category) query.category = category;
    if (search) query.search = search;
    api
      .get("/products", { params: query })
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <form onSubmit={onSearchSubmit} className="mt-4 flex gap-2">
          <input
            className="input max-w-md"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setSearchInput("");
                updateParam("search", "");
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <CategoryFilter
        categories={categories}
        active={category}
        onChange={(id) => updateParam("category", id)}
      />

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try a different search or category."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
