import { useEffect, useRef } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { Message } from "../types";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = (): void => {
    const { socket } = useSocketContext();
    const { messages, setMessages, selectedConversation, unreadCounts, setUnreadCounts } = useConversation();
    
    // Use refs to access latest values without re-registering listeners
    const messagesRef = useRef(messages);
    const selectedConversationRef = useRef(selectedConversation);
    const unreadCountsRef = useRef(unreadCounts);

    // Update refs when values change
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    useEffect(() => {
        unreadCountsRef.current = unreadCounts;
    }, [unreadCounts]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: Message) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();

            const senderId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId;
            const receiverId = typeof newMessage.receiverId === 'object' ? newMessage.receiverId?._id : newMessage.receiverId;
            const currentConversation = selectedConversationRef.current;
            const currentMessages = messagesRef.current;
            const currentUnreadCounts = unreadCountsRef.current;

            if (currentConversation?._id === receiverId || currentConversation?._id === senderId) {
                setMessages([...currentMessages, newMessage]);
            } else {
                // Increment unread count
                const senderIdStr = String(senderId);
                setUnreadCounts({
                    ...currentUnreadCounts,
                    [senderIdStr]: (currentUnreadCounts[senderIdStr] || 0) + 1
                });
            }
        };

        const handleNewGroupMessage = (newMessage: Message) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();

            const currentConversation = selectedConversationRef.current;
            const currentMessages = messagesRef.current;
            const currentUnreadCounts = unreadCountsRef.current;
            const groupId = String(newMessage.groupId || '');

            if (currentConversation?._id === groupId && currentConversation?.type === "group") {
                setMessages([...currentMessages, newMessage]);
            } else {
                // Increment unread count for group
                setUnreadCounts({
                    ...currentUnreadCounts,
                    [groupId]: (currentUnreadCounts[groupId] || 0) + 1
                });
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("newGroupMessage", handleNewGroupMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("newGroupMessage", handleNewGroupMessage);
        };
    }, [socket, setMessages, setUnreadCounts]);
};

export default useListenMessages;

