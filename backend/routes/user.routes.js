import express from "express";
import { getUsersForSidebar, addContact, updateProfile, deleteConversation } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.post("/add", protectRoute, addContact);
router.put("/profile", protectRoute, updateProfile);
router.delete("/conversation", protectRoute, deleteConversation);

export default router;
