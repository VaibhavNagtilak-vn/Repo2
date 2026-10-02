export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`rounded-full px-4 py-1.5 text-sm transition ${
          active === ""
            ? "bg-brand-600 text-white"
            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          type="button"
          onClick={() => onChange(c._id)}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            active === c._id
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
