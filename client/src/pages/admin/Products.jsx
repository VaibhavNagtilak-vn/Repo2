import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import DataTable from "../../components/admin/DataTable.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Loader from "../../components/Loader.jsx";
import { formatCurrency } from "../../utils/format.js";
import { useToast } from "../../context/ToastContext.jsx";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const toast = useToast();

  function load() {
    setLoading(true);
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openAdd() {
    setForm(EMPTY);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      image: p.image || "",
      category: p.category?._id || p.category || "",
      stock: String(p.stock),
    });
    setEditingId(p._id);
    setModalOpen(true);
  }

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function save(e) {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    if (!(price > 0)) {
      toast.error("Price must be greater than zero");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be a non-negative integer");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price,
      image: form.image,
      category: form.category,
      stock,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/products/${toDelete._id}`);
      toast.success("Product deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (r) => (
        <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
          {r.image ? (
            <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-300">
              —
            </div>
          )}
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "category", label: "Category", render: (r) => r.category?.name || "—" },
    { key: "price", label: "Price", render: (r) => formatCurrency(r.price) },
    {
      key: "stock",
      label: "Stock",
      render: (r) => (
        <span className={r.stock === 0 ? "text-red-600" : "text-gray-700"}>{r.stock}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" className="btn-outline !px-3 !py-1" onClick={() => openEdit(r)}>
            Edit
          </button>
          <button type="button" className="btn-danger !px-3 !py-1" onClick={() => setToDelete(r)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <button type="button" className="btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={products} emptyMessage="No products yet" />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <form
            onSubmit={save}
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="p-name">Product name</label>
                <input id="p-name" name="name" className="input" value={form.name} onChange={onChange} />
              </div>
              <div>
                <label className="label" htmlFor="p-desc">Description</label>
                <textarea id="p-desc" name="description" rows={3} className="input" value={form.description} onChange={onChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="p-price">Price</label>
                  <input id="p-price" name="price" type="number" min="0.01" step="0.01" className="input" value={form.price} onChange={onChange} />
                </div>
                <div>
                  <label className="label" htmlFor="p-stock">Stock</label>
                  <input id="p-stock" name="stock" type="number" min="0" step="1" className="input" value={form.stock} onChange={onChange} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="p-image">Image URL</label>
                <input id="p-image" name="image" type="url" className="input" value={form.image} onChange={onChange} placeholder="https://..." />
              </div>
              <div>
                <label className="label" htmlFor="p-cat">Category</label>
                <select id="p-cat" name="category" className="input" value={form.category} onChange={onChange}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product?"
        message={toDelete ? `"${toDelete.name}" will be permanently removed.` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
