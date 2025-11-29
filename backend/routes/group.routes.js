import express from "express";
import {
    createGroup,
    getGroups,
    addMemberToGroup,
    sendGroupMessage,
    getGroupMessages,
} from "../controllers/group.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getGroups);
router.post("/add-member", protectRoute, addMemberToGroup);
router.post("/:groupId/message", protectRoute, sendGroupMessage);
router.get("/:groupId/messages", protectRoute, getGroupMessages);

export default router;

