import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const currentUser = await User.findById(loggedInUserId).populate("contacts", "-password");

        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const conversations = await Conversation.find({
            participants: loggedInUserId,
        }).populate("participants", "-password");

        const conversationUsers = new Map();
        conversations.forEach(conv => {
            conv.participants.forEach(participant => {
                if (participant._id.toString() !== loggedInUserId.toString()) {
                    conversationUsers.set(participant._id.toString(), participant);
                }
            });
        });

        const usersWithInfo = await Promise.all(
            Array.from(conversationUsers.values()).map(async (user) => {
                const isContact = currentUser.contacts?.some(contact =>
                    contact._id.toString() === user._id.toString()
                ) || false;

                const unreadCount = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    read: false
                });

                return {
                    ...user.toObject(),
                    isContact,
                    unreadCount
                };
            })
        );

        res.status(200).json(usersWithInfo);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addContact = async (req, res) => {
    try {
        const { email } = req.body;
        const loggedInUserId = req.user._id;

        const userToAdd = await User.findOne({ email }).select("-password");

        if (!userToAdd) {
            return res.status(404).json({ error: "User not found with this email" });
        }

        if (userToAdd._id.toString() === loggedInUserId.toString()) {
            return res.status(400).json({ error: "You cannot add yourself" });
        }

        const currentUser = await User.findById(loggedInUserId);

        if (currentUser.contacts.includes(userToAdd._id)) {
            return res.status(400).json({ error: "User already in contacts" });
        }

        // Bidirectional contact addition:
        // When B adds A, both A and B should appear in each other's General list
        // 1. Add userToAdd to currentUser's contacts
        currentUser.contacts.push(userToAdd._id);
        await currentUser.save();

        // 2. Add currentUser to userToAdd's contacts (bidirectional)
        if (!userToAdd.contacts.includes(loggedInUserId)) {
            userToAdd.contacts.push(loggedInUserId);
            await userToAdd.save();
        }

        res.status(200).json(userToAdd);
    } catch (error) {
        console.error("Error in addContact: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, profilePic } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use" });
            }
            user.email = email;
        }

        if (fullName) user.fullName = fullName;
        if (profilePic) user.profilePic = profilePic;

        await user.save();

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in updateProfile: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const loggedInUserId = req.user._id;

        const currentUser = await User.findById(loggedInUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "Current user not found" });
        }

        const otherUser = await User.findById(userId);

        // Bidirectional contact removal:
        // When B deletes A, remove A from B's contacts AND B from A's contacts
        // 1. Remove userToDelete from currentUser's contacts
        if (currentUser.contacts && Array.isArray(currentUser.contacts)) {
            currentUser.contacts = currentUser.contacts.filter(
                contactId => contactId.toString() !== userId
            );
        } else {
            currentUser.contacts = [];
        }
        await currentUser.save();

        // 2. Remove currentUser from otherUser's contacts (bidirectional)
        if (otherUser) {
            if (otherUser.contacts && Array.isArray(otherUser.contacts)) {
                otherUser.contacts = otherUser.contacts.filter(
                    contactId => contactId.toString() !== loggedInUserId.toString()
                );
            } else {
                otherUser.contacts = [];
            }
            await otherUser.save();
        }

        await Conversation.findOneAndDelete({
            participants: { $all: [loggedInUserId, userId] }
        });

        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error in deleteConversation: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
