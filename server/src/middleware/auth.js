import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
}
