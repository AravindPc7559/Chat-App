import useGetGroups from "../../hooks/useGetGroups";
import Group from "./Group";

const Groups = () => {
    const { loading, groups } = useGetGroups();

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {groups.length === 0 && !loading && (
                <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
                    <p className='text-gray-500 text-sm'>
                        No groups yet
                    </p>
                    <p className='text-gray-400 text-xs mt-1'>
                        Create a group to start chatting with multiple people
                    </p>
                </div>
            )}
            {groups.map((group, idx) => (
                <Group
                    key={group._id}
                    group={group}
                    lastIdx={idx === groups.length - 1}
                />
            ))}

            {loading && (
                <div className='flex justify-center py-8'>
                    <span className='loading loading-spinner text-indigo-600'></span>
                </div>
            )}
        </div>
    );
};

export default Groups;

