import { useState } from "react";
import toast from "react-hot-toast";
import useGetConversations from "./useGetConversations";

const useAddContact = () => {
    const [loading, setLoading] = useState(false);
    const { setConversations, conversations } = useGetConversations();

    const addContact = async (email) => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            // We need to update the conversations list. 
            // Since useGetConversations uses local state in the component, 
            // we might need to trigger a re-fetch or update a global state.
            // For now, let's just reload the page or rely on the user to refresh, 
            // OR better, we can return the new contact and let the component handle it.

            return data;

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, addContact };
};
export default useAddContact;
