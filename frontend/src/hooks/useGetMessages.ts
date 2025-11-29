import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { UseGetMessagesReturn, Message, ApiResponse } from "../types";

const useGetMessages = (): UseGetMessagesReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                let res: Response;
                if (selectedConversation?.type === "group") {
                    res = await fetch(`/api/groups/${selectedConversation._id}/messages`, {
                        credentials: "include",
                    });
                } else {
                    res = await fetch(`/api/messages/${selectedConversation._id}`, {
                        credentials: "include",
                    });
                }
                const data: Message[] | ApiResponse = await res.json();
                if (!Array.isArray(data)) {
                    if ('error' in data) {
                        throw new Error(data.error);
                    }
                    throw new Error("Invalid response format");
                }
                setMessages(data);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch messages";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, selectedConversation?.type, setMessages]);

    return { messages, loading };
};

export default useGetMessages;

