import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";
import { Conversation, UseGetConversationsReturn } from "../types";

const useGetConversations = (): UseGetConversationsReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { setUnreadCounts } = useConversation();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users", {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data);

                // Extract unread counts
                const counts: Record<string, number> = {};
                data.forEach((user: Conversation) => {
                    counts[user._id] = user.unreadCount || 0;
                });
                setUnreadCounts(counts);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch conversations";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, [setUnreadCounts]);

    return { loading, conversations, setConversations };
};

export default useGetConversations;

