import express from "express";
import { translateToEnglish } from "../controllers/translate.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, translateToEnglish);

export default router;
