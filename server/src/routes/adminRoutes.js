import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = Router();

router.use(protect, admin);

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);

export default router;
