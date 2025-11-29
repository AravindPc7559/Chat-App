import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Group, UseGetGroupsReturn, ApiResponse } from "../types";

const useGetGroups = (): UseGetGroupsReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const getGroups = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/groups", {
                    credentials: "include",
                });
                const data: Group[] | ApiResponse = await res.json();
                if (!Array.isArray(data)) {
                    if ('error' in data) {
                        throw new Error(data.error);
                    }
                    throw new Error("Invalid response format");
                }
                setGroups(data);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch groups";
                console.error("Error in useGetGroups: ", errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        getGroups();
    }, []);

    return { loading, groups, setGroups };
};

export default useGetGroups;

