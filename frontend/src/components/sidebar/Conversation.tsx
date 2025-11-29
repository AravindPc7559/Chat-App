import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";
import { IoTrashOutline } from "react-icons/io5";
import { useState, MouseEvent } from "react";
import { Conversation as ConversationType } from "../../types";
import { ApiResponse } from "../../types";

interface ConversationProps {
    conversation: ConversationType;
    lastIdx: boolean;
}

const Conversation = ({ conversation, lastIdx }: ConversationProps) => {
    const { selectedConversation, setSelectedConversation, unreadCounts } = useConversation();
    const [deleting, setDeleting] = useState<boolean>(false);

    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);
    const unreadCount = unreadCounts[conversation._id] || 0;

    const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this conversation?")) return;

        setDeleting(true);
        try {
            const res = await fetch("/api/users/conversation", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId: conversation._id }),
            });

            const data: ApiResponse = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Conversation deleted");
            window.location.reload();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete conversation";
            toast.error(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div
                className={`flex gap-3 items-center rounded-xl p-3 cursor-pointer relative group transition-all duration-200 mx-2 my-1
                    ${isSelected ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-md" : "bg-white/80 hover:bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-sm"}
                `}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`relative ${isOnline ? "online" : ""}`}>
                    <div className='w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white ring-indigo-200'>
                        <img src={conversation.profilePic} alt='user avatar' className="w-full h-full object-cover" />
                    </div>
                    {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                </div>

                <div className='flex flex-col flex-1 min-w-0'>
                    <div className='flex gap-2 justify-between items-center'>
                        <p className={`font-semibold truncate ${isSelected ? "text-indigo-700" : "text-gray-800"}`}>
                            {conversation.fullName}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="flex justify-end mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold min-w-[20px] text-center">
                                {unreadCount}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Delete conversation"
                >
                    <IoTrashOutline className="w-5 h-5" />
                </button>
            </div>

            {!lastIdx && <div className='h-1' />}
        </>
    );
};

export default Conversation;

