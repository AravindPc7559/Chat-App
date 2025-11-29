import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const adminId = req.user._id;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Group name is required" });
        }

        // Create group with admin as first member
        const group = await Group.create({
            name: name.trim(),
            description: description || "",
            admin: adminId,
            members: [adminId],
        });

        // Populate admin and members
        await group.populate("admin", "-password");
        await group.populate("members", "-password");

        res.status(201).json(group);
    } catch (error) {
        console.error("Error in createGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all groups where user is a member
        const groups = await Group.find({
            members: userId,
        })
            .populate("admin", "-password")
            .populate("members", "-password")
            .sort({ updatedAt: -1 });

        // Calculate unread counts for each group
        const groupsWithUnread = await Promise.all(
            groups.map(async (group) => {
                const unreadCount = await Message.countDocuments({
                    groupId: group._id,
                    senderId: { $ne: userId },
                    read: false,
                });

                return {
                    ...group.toObject(),
                    unreadCount,
                };
            })
        );

        res.status(200).json(groupsWithUnread);
    } catch (error) {
        console.error("Error in getGroups: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addMemberToGroup = async (req, res) => {
    try {
        const { groupId, email } = req.body;
        const userId = req.user._id;

        if (!groupId || !email) {
            return res.status(400).json({ error: "Group ID and email are required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is admin or member
        const isAdmin = group.admin.toString() === userId.toString();
        const isMember = group.members.some(
            (memberId) => memberId.toString() === userId.toString()
        );

        if (!isAdmin && !isMember) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }

        // Find user by email
        const userToAdd = await User.findOne({ email }).select("-password");
        if (!userToAdd) {
            return res.status(404).json({ error: "User not found with this email" });
        }

        // Check if user is already a member
        if (group.members.some((memberId) => memberId.toString() === userToAdd._id.toString())) {
            return res.status(400).json({ error: "User is already a member of this group" });
        }

        // Add user to group
        group.members.push(userToAdd._id);
        await group.save();

        await group.populate("admin", "-password");
        await group.populate("members", "-password");

        res.status(200).json(group);
    } catch (error) {
        console.error("Error in addMemberToGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { groupId } = req.params;
        const senderId = req.user._id;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is a member
        const isMember = group.members.some(
            (memberId) => memberId.toString() === senderId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }

        // Create message
        const newMessage = new Message({
            senderId,
            groupId,
            message: message.trim(),
        });

        if (newMessage) {
            group.messages.push(newMessage._id);
        }

        await Promise.all([group.save(), newMessage.save()]);

        // Populate sender for socket emission
        await newMessage.populate("senderId", "-password");

        // Convert message to plain object for socket emission
        const messageObj = newMessage.toObject();
        messageObj.groupId = groupId.toString();

        // Get all unique member IDs (admin is already in members, but ensure we have all)
        const allMemberIds = new Set();
        allMemberIds.add(group.admin.toString());
        group.members.forEach(memberId => {
            allMemberIds.add(memberId.toString());
        });

        // Emit to all group members
        allMemberIds.forEach((memberId) => {
            const memberSocketId = getReceiverSocketId(memberId);
            if (memberSocketId) {
                io.to(memberSocketId).emit("newGroupMessage", messageObj);
            }
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendGroupMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId).populate("messages");

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is a member
        const isMember = group.members.some(
            (memberId) => memberId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }

        const messages = await Message.find({ groupId })
            .populate("senderId", "-password")
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            { groupId, senderId: { $ne: userId }, read: false },
            { read: true }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getGroupMessages: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

