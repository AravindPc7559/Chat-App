import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createOrder, verifyPayment, getPaymentStatus, testRazorpayConfig } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/test-config", protectRoute, testRazorpayConfig);
router.post("/create-order", protectRoute, createOrder);
router.post("/verify", protectRoute, verifyPayment);
router.get("/status/:orderId", protectRoute, getPaymentStatus);

export default router;

