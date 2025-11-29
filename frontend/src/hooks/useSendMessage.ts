import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { UseSendMessageReturn, Message } from "../types";

const useSendMessage = (): UseSendMessageReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message: string): Promise<void> => {
        if (!selectedConversation?._id) {
            toast.error("No conversation selected");
            return;
        }

        setLoading(true);
        try {
            let res: Response;
            if (selectedConversation?.type === "group") {
                res = await fetch(`/api/groups/${selectedConversation._id}/message`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ message }),
                });
            } else {
                res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ message }),
                });
            }
            const data: Message = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages([...messages, data]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to send message";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;

