import { useState } from "react";
import toast from "react-hot-toast";
import useGetConversations from "./useGetConversations";
import { User, ApiResponse } from "../types";

const useAddContact = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setConversations } = useGetConversations();

    const addContact = async (email: string): Promise<User | undefined> => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email }),
            });
            const data: User | ApiResponse = await res.json();
            if ('error' in data) {
                throw new Error(data.error);
            }

            return data as User;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to add contact";
            toast.error(errorMessage);
            return undefined;
        } finally {
            setLoading(false);
        }
    };

    return { loading, addContact };
};

export default useAddContact;

