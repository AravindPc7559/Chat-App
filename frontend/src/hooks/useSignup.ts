import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { User, ApiResponse } from "../types";

interface SignupInputs {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender: "male" | "female";
    email: string;
}

const useSignup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullName, username, password, confirmPassword, gender, email }: SignupInputs): Promise<void> => {
        const success = handleInputErrors({ fullName, username, password, confirmPassword, gender, email });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ fullName, username, password, confirmPassword, gender, email }),
            });

            const data: User | ApiResponse = await res.json();
            if ('error' in data) {
                throw new Error(data.error);
            }
            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data as User);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Signup failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

function handleInputErrors({ fullName, username, password, confirmPassword, gender, email }: SignupInputs): boolean {
    if (!fullName || !username || !password || !confirmPassword || !gender || !email) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}

export default useSignup;

