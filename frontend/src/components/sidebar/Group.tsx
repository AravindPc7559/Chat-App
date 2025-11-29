import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";
import { IoPeople } from "react-icons/io5";
import { useState, MouseEvent, FormEvent } from "react";
import useAddMemberToGroup from "../../hooks/useAddMemberToGroup";
import { Group as GroupType } from "../../types";

interface GroupProps {
    group: GroupType;
    lastIdx: boolean;
}

const Group = ({ group, lastIdx }: GroupProps) => {
    const { selectedConversation, setSelectedConversation, unreadCounts } = useConversation();
    const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const { addMember, loading: addingMember } = useAddMemberToGroup();

    const isSelected = selectedConversation?._id === group._id && selectedConversation?.type === "group";
    const unreadCount = unreadCounts[group._id] || 0;

    const handleAddMember = async (e: FormEvent<HTMLFormElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (!email || email.trim() === "") {
            toast.error("Please enter an email");
            return;
        }

        try {
            await addMember(group._id, email.trim());
            setEmail("");
            setShowAddMemberModal(false);
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const handleGroupClick = () => {
        setSelectedConversation({ ...group, type: "group" });
    };

    return (
        <>
            <div
                className={`flex gap-3 items-center rounded-xl p-3 cursor-pointer relative group transition-all duration-200 mx-2 my-1
                    ${isSelected ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-md" : "bg-white/80 hover:bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-sm"}
                `}
                onClick={handleGroupClick}
            >
                <div className="relative">
                    <div className='w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white ring-indigo-200 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center'>
                        {group.groupPic ? (
                            <img src={group.groupPic} alt='group avatar' className="w-full h-full object-cover" />
                        ) : (
                            <IoPeople className="w-6 h-6 text-white" />
                        )}
                    </div>
                </div>

                <div className='flex flex-col flex-1 min-w-0'>
                    <div className='flex gap-2 justify-between items-center'>
                        <p className={`font-semibold truncate ${isSelected ? "text-indigo-700" : "text-gray-800"}`}>
                            {group.name}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                        {Array.isArray(group.members) ? group.members.length : 0} members
                    </p>
                    {unreadCount > 0 && (
                        <div className="flex justify-end mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold min-w-[20px] text-center">
                                {unreadCount}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setShowAddMemberModal(true);
                    }}
                    title="Add member"
                >
                    <IoPeople className="w-5 h-5" />
                </button>
            </div>

            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddMemberModal(false)}>
                    <div 
                        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Add Member to {group.name}</h3>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter member email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        setShowAddMemberModal(false);
                                        setEmail("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={addingMember}
                                >
                                    {addingMember ? <span className="loading loading-spinner loading-sm"></span> : "Add Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!lastIdx && <div className='h-1' />}
        </>
    );
};

export default Group;

