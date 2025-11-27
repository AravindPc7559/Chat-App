import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages, selectedConversation, unreadCounts, setUnreadCounts } = useConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();

            if (selectedConversation?._id === newMessage.senderId) {
                setMessages([...messages, newMessage]);
            } else {
                // Increment unread count
                const senderId = newMessage.senderId;
                setUnreadCounts({
                    ...unreadCounts,
                    [senderId]: (unreadCounts[senderId] || 0) + 1
                });
            }
        });

        return () => socket?.off("newMessage");
    }, [socket, setMessages, messages, selectedConversation, unreadCounts, setUnreadCounts]);
};
export default useListenMessages;
