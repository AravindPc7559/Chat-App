import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import useAddContact from "../../hooks/useAddContact";
import toast from "react-hot-toast";
import { IoTrashOutline } from "react-icons/io5";
import { useState } from "react";

const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { selectedConversation, setSelectedConversation, unreadCounts } = useConversation();
    const { addContact } = useAddContact();
    const [deleting, setDeleting] = useState(false);

    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);
    const unreadCount = unreadCounts[conversation._id] || 0;
    const isContact = conversation.isContact !== false; // Default to true for backward compatibility

    const handleAddContact = async (e) => {
        e.stopPropagation();
        const result = await addContact(conversation.email);
        if (result) {
            toast.success("Contact added successfully");
            window.location.reload();
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this conversation?")) return;

        setDeleting(true);
        try {
            const res = await fetch("/api/users/conversation", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: conversation._id }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Conversation deleted");
            window.location.reload();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div
                className={`flex gap-2 items-center rounded-lg p-3 cursor-pointer relative group transition-all border
				${isSelected ? "bg-[#f0f2f5] border-[#128C7E]" : "bg-white border-gray-200 hover:bg-[#f5f5f5]"}
			`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 rounded-full'>
                        <img src={conversation.profilePic} alt='user avatar' />
                    </div>
                </div>

                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between items-center'>
                        <p className='font-bold text-gray-900'>{conversation.fullName}</p>
                        <span className='text-xl'>{emoji}</span>
                    </div>
                    {!isContact && (
                        <button
                            className="btn btn-xs btn-success mt-1"
                            onClick={handleAddContact}
                        >
                            Add to Contacts
                        </button>
                    )}
                    {unreadCount > 0 && (
                        <div className="flex justify-end">
                            <span className="badge badge-error badge-sm text-white font-bold">{unreadCount}</span>
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    <IoTrashOutline className="w-5 h-5" />
                </button>
            </div>

            {!lastIdx && <div className='my-1' />}
        </>
    );
};
export default Conversation;
