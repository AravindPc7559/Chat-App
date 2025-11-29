import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { User, ApiResponse } from "../types";

interface UpdateProfileInputs {
    fullName?: string;
    email?: string;
    profilePic?: string;
}

const useUpdateProfile = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const updateProfile = async ({ fullName, email, profilePic }: UpdateProfileInputs): Promise<void> => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ fullName, email, profilePic }),
            });

            const data: User | ApiResponse = await res.json();
            if ('error' in data) {
                throw new Error(data.error);
            }

            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data as User);
            toast.success("Profile updated successfully");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateProfile };
};

export default useUpdateProfile;

