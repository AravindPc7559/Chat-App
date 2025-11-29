import { useState } from "react";
import toast from "react-hot-toast";
import useGetGroups from "./useGetGroups";

const useAddMemberToGroup = () => {
    const [loading, setLoading] = useState(false);
    const { setGroups } = useGetGroups();

    const addMember = async (groupId, email) => {
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

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Member added successfully");
            
            // Refresh groups list
            const groupsRes = await fetch("/api/groups", {
                credentials: "include",
            });
            const groupsData = await groupsRes.json();
            if (!groupsData.error) {
                setGroups(groupsData);
            }

            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loading, addMember };
};

export default useAddMemberToGroup;

