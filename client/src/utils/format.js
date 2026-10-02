export function formatCurrency(value) {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export const STATUS_COLORS = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};
