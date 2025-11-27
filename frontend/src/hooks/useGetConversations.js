import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const { setUnreadCounts } = useConversation();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data);

                // Extract unread counts
                const counts = {};
                data.forEach(user => {
                    counts[user._id] = user.unreadCount || 0;
                });
                setUnreadCounts(counts);

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, [setUnreadCounts]);

    return { loading, conversations, setConversations };
};
export default useGetConversations;
