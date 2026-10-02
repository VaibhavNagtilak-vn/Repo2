import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import DataTable from "../../components/admin/DataTable.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Loader from "../../components/Loader.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const EMPTY = { name: "", description: "" };

export default function Categories() {
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
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openAdd() {
    setForm(EMPTY);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(c) {
    setForm({ name: c.name, description: c.description || "" });
    setEditingId(c._id);
    setModalOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/categories", form);
        toast.success("Category created");
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
      await api.delete(`/categories/${toDelete._id}`);
      toast.success("Category deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description", render: (r) => r.description || "—" },
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
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <button type="button" className="btn-primary" onClick={openAdd}>
          + Add Category
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={categories} emptyMessage="No categories yet" />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={save} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Category" : "Add Category"}
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="cat-name">Name</label>
                <input
                  id="cat-name"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="cat-desc">Description</label>
                <textarea
                  id="cat-desc"
                  className="input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
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
        title="Delete category?"
        message={toDelete ? `"${toDelete.name}" will be permanently removed.` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
