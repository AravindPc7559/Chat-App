import Conversations from "./Conversations";
import Groups from "./Groups";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { IoPersonAddSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoPeople } from "react-icons/io5";
import { useState, FormEvent, MouseEvent } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useGetConversations from "../../hooks/useGetConversations";
import useCreateGroup from "../../hooks/useCreateGroup";
import { ApiResponse } from "../../types";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState<"chat" | "group">("chat");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [groupName, setGroupName] = useState<string>("");
    const [groupDescription, setGroupDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { conversations } = useGetConversations();
    const { createGroup, loading: creatingGroup } = useCreateGroup();

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !message) {
            toast.error("Please enter email and message");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/messages/send-by-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, message }),
            });

            const data: ApiResponse = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            toast.success("Message sent successfully");
            setIsModalOpen(false);
            setEmail("");
            setMessage("");
            window.location.reload();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to send message";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!groupName || groupName.trim() === "") {
            toast.error("Please enter a group name");
            return;
        }

        try {
            await createGroup(groupName.trim(), groupDescription.trim());
            setIsCreateGroupModalOpen(false);
            setGroupName("");
            setGroupDescription("");
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    return (
        <div className='w-full md:w-80 lg:w-96 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 flex flex-col h-full flex-shrink-0 min-h-0'>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 flex items-center justify-between shadow-md">
                <h2 className="text-white font-bold text-xl tracking-tight">Messages</h2>
                <div className="flex gap-2">
                    {activeTab === "chat" ? (
                        <button 
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm" 
                            onClick={() => setIsModalOpen(true)}
                            title="New Message"
                        >
                            <IoPersonAddSharp className='w-5 h-5' />
                        </button>
                    ) : (
                        <button 
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm" 
                            onClick={() => setIsCreateGroupModalOpen(true)}
                            title="Create Group"
                        >
                            <IoPeople className='w-5 h-5' />
                        </button>
                    )}
                    <Link 
                        to='/profile' 
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm"
                        title="Profile"
                    >
                        <CgProfile className='w-5 h-5' />
                    </Link>
                </div>
            </div>

            <div className="px-3 py-3 bg-white/50 backdrop-blur-sm border-b border-gray-100">
                <SearchInput />
            </div>

            {/* Tabs for Chat and Group */}
            <div className="flex border-b border-gray-200 bg-white/80">
                <button
                    onClick={() => setActiveTab("chat")}
                    className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                        activeTab === "chat"
                            ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                >
                    Chat
                </button>
                <button
                    onClick={() => setActiveTab("group")}
                    className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                        activeTab === "group"
                            ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                >
                    Group
                </button>
            </div>

            <div className='flex-1 overflow-y-auto bg-white/30 backdrop-blur-sm px-2'>
                {activeTab === "chat" ? <Conversations /> : <Groups />}
            </div>

            <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-3">
                <LogoutButton />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div 
                        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Send New Message</h3>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800 resize-none"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner loading-sm"></span> : "Send Message"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCreateGroupModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsCreateGroupModalOpen(false)}>
                    <div 
                        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Group</h3>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter group name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    placeholder="Enter group description..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800 resize-none"
                                    rows={3}
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        setIsCreateGroupModalOpen(false);
                                        setGroupName("");
                                        setGroupDescription("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={creatingGroup}
                                >
                                    {creatingGroup ? <span className="loading loading-spinner loading-sm"></span> : "Create Group"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;

