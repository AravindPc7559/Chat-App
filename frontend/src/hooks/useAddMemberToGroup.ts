import { useState } from "react";
import toast from "react-hot-toast";
import useGetGroups from "./useGetGroups";
import { Group, ApiResponse } from "../types";

const useAddMemberToGroup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setGroups } = useGetGroups();

    const addMember = async (groupId: string, email: string): Promise<Group> => {
        setLoading(true);
        try {
            const res = await fetch("/api/groups/add-member", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ groupId, email }),
            });

            const data: Group | ApiResponse = await res.json();
            if ('error' in data) throw new Error(data.error);

            toast.success("Member added successfully");
            
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
            const errorMessage = error instanceof Error ? error.message : "Failed to add member";
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loading, addMember };
};

export default useAddMemberToGroup;

