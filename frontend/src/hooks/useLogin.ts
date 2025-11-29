import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { User, ApiResponse } from "../types";

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username: string, password: string): Promise<void> => {
        const success = handleInputErrors(username, password);
        if (!success) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data: User | ApiResponse = await res.json();
            if ('error' in data) {
                throw new Error(data.error);
            }

            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data as User);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Login failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

function handleInputErrors(username: string, password: string): boolean {
    if (!username || !password) {
        toast.error("Please fill in all fields");
        return false;
    }
    return true;
}

export default useLogin;

