import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

async function seedAdmin() {
  await connectDB();

  const name = process.env.ADMIN_NAME || "Admin";
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    if (process.env.ADMIN_PASSWORD) existing.password = password;
    await existing.save();
    console.log(`Admin updated: ${email}`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Admin created: ${email}`);
  }

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
