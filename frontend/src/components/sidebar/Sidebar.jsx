import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { IoPersonAddSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e) => {
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
                body: JSON.stringify({ email, message }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            toast.success("Message sent successfully");
            setIsModalOpen(false);
            setEmail("");
            setMessage("");
            window.location.reload();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full sm:w-[400px] border-r border-gray-300 bg-white flex flex-col'>
            <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between">
                <h2 className="text-white font-semibold text-xl">Chats</h2>
                <div className="flex gap-2">
                    <button className="btn btn-circle btn-sm bg-[#128C7E] border-none text-white hover:bg-[#075E54]" onClick={() => setIsModalOpen(true)}>
                        <IoPersonAddSharp className='w-5 h-5' />
                    </button>
                    <Link to='/profile' className="btn btn-circle btn-sm bg-[#128C7E] border-none text-white hover:bg-[#075E54]">
                        <CgProfile className='w-5 h-5' />
                    </Link>
                </div>
            </div>

            <div className="px-3 py-2 bg-[#f6f6f6]">
                <SearchInput />
            </div>

            <div className='flex-1 overflow-y-auto bg-white px-2 sm:px-0'>
                <Conversations />
            </div>

            <div className="border-t border-gray-200 p-2">
                <LogoutButton />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Send Message</h3>
                        <form onSubmit={handleSendMessage}>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="input input-bordered w-full mb-4 bg-white text-gray-800"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <textarea
                                placeholder="Type your message..."
                                className="textarea textarea-bordered w-full mb-4 bg-white text-gray-800"
                                rows="3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-ghost text-gray-600"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn bg-[#25D366] text-white hover:bg-[#128C7E] border-none" disabled={loading}>
                                    {loading ? <span className="loading loading-spinner"></span> : "Send"}
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
