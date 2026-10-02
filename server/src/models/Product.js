import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: {
      type: Number,
      required: true,
      min: [0.01, "Price must be greater than zero"],
    },
    image: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
