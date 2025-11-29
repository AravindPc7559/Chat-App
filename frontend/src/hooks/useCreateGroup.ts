import { useState } from "react";
import toast from "react-hot-toast";
import useGetGroups from "./useGetGroups";
import { Group, ApiResponse } from "../types";

const useCreateGroup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setGroups } = useGetGroups();

    const createGroup = async (name: string, description: string = ""): Promise<Group> => {
        setLoading(true);
        try {
            const res = await fetch("/api/groups/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ name, description }),
            });

            const data: Group | ApiResponse = await res.json();
            if ('error' in data) throw new Error(data.error);

            toast.success("Group created successfully");
            
            // Refresh groups list
            const groupsRes = await fetch("/api/groups", {
                credentials: "include",
            });
            const groupsData: Group[] = await groupsRes.json();
            if (!Array.isArray(groupsData) || (groupsData.length > 0 && 'error' in groupsData[0])) {
                throw new Error("Failed to refresh groups");
            }
            setGroups(groupsData);

            return data as Group;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create group";
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loading, createGroup };
};

export default useCreateGroup;

