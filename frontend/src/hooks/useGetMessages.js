import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                let res;
                if (selectedConversation?.type === "group") {
                    res = await fetch(`/api/groups/${selectedConversation._id}/messages`, {
                        credentials: "include",
                    });
                } else {
                    res = await fetch(`/api/messages/${selectedConversation._id}`, {
                        credentials: "include",
                    });
                }
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setMessages(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, selectedConversation?.type, setMessages]);

    return { messages, loading };
};
export default useGetMessages;
