import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

const CATEGORIES = [
  { name: "Electronics", description: "Phones, laptops, audio and everyday gadgets" },
  { name: "Clothing", description: "T-shirts, shirts, jeans and seasonal wear" },
  { name: "Home & Kitchen", description: "Cookware, appliances and home essentials" },
  { name: "Books", description: "Fiction, non-fiction and programming titles" },
];

const PRODUCTS = [
  // Electronics
  { name: "Wireless Earbuds", category: "Electronics", price: 2499, stock: 40, image: "https://picsum.photos/seed/earbuds/600/600", description: "Compact true-wireless earbuds with charging case and 20-hour battery life." },
  { name: "Smart Watch", category: "Electronics", price: 4999, stock: 25, image: "https://picsum.photos/seed/smartwatch/600/600", description: "Fitness tracking smartwatch with heart-rate monitor and AMOLED display." },
  { name: "Bluetooth Speaker", category: "Electronics", price: 1899, stock: 30, image: "https://picsum.photos/seed/speaker/600/600", description: "Portable water-resistant speaker with deep bass and 12-hour playtime." },
  { name: "Mechanical Keyboard", category: "Electronics", price: 3499, stock: 18, image: "https://picsum.photos/seed/keyboard/600/600", description: "RGB backlit mechanical keyboard with tactile blue switches." },

  // Clothing
  { name: "Cotton T-Shirt", category: "Clothing", price: 599, stock: 100, image: "https://picsum.photos/seed/tshirt/600/600", description: "Soft breathable 100% cotton t-shirt available in multiple colors." },
  { name: "Denim Jeans", category: "Clothing", price: 1499, stock: 60, image: "https://picsum.photos/seed/jeans/600/600", description: "Slim-fit stretch denim jeans with classic five-pocket styling." },
  { name: "Casual Shirt", category: "Clothing", price: 999, stock: 45, image: "https://picsum.photos/seed/shirt/600/600", description: "Lightweight checked casual shirt perfect for everyday wear." },

  // Home & Kitchen
  { name: "Non-Stick Frying Pan", category: "Home & Kitchen", price: 1299, stock: 35, image: "https://picsum.photos/seed/pan/600/600", description: "24cm non-stick frying pan with heat-resistant handle." },
  { name: "Electric Kettle", category: "Home & Kitchen", price: 899, stock: 50, image: "https://picsum.photos/seed/kettle/600/600", description: "1.8L stainless steel electric kettle with auto shut-off." },
  { name: "Steel Water Bottle", category: "Home & Kitchen", price: 649, stock: 80, image: "https://picsum.photos/seed/bottle/600/600", description: "Insulated 1L steel bottle that keeps drinks cold for 24 hours." },

  // Books
  { name: "Clean Code", category: "Books", price: 799, stock: 22, image: "https://picsum.photos/seed/cleancode/600/600", description: "A handbook of agile software craftsmanship by Robert C. Martin." },
  { name: "The Pragmatic Programmer", category: "Books", price: 899, stock: 15, image: "https://picsum.photos/seed/pragmatic/600/600", description: "Your journey to mastery, by Hunt and Thomas." },
];

async function seedCatalog() {
  await connectDB();

  const catIds = {};
  for (const c of CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { name: c.name },
      { $setOnInsert: c },
      { new: true, upsert: true }
    );
    catIds[c.name] = doc._id;
  }
  console.log(`Categories ready: ${Object.keys(catIds).length}`);

  let upserted = 0;
  for (const p of PRODUCTS) {
    const { category, ...rest } = p;
    await Product.findOneAndUpdate(
      { name: p.name },
      { $set: { ...rest, category: catIds[category] } },
      { new: true, upsert: true }
    );
    upserted++;
  }
  console.log(`Products seeded: ${upserted}`);

  process.exit(0);
}

seedCatalog().catch((err) => {
  console.error(err);
  process.exit(1);
});
