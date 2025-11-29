import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ApiResponse } from "../types";

const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const logout = async (): Promise<void> => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data: ApiResponse = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem("chat-user");
            setAuthUser(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Logout failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};

export default useLogout;

