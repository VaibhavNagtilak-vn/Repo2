import Category from "../models/Category.js";
import Product from "../models/Product.js";

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    await category.save();
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const inUse = await Product.countDocuments({ category: category._id });
    if (inUse > 0) {
      return res
        .status(400)
        .json({ message: `Cannot delete: ${inUse} product(s) use this category` });
    }
    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
}
