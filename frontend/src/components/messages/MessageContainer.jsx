import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation, setUnreadCounts, unreadCounts } = useConversation();

    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    useEffect(() => {
        if (selectedConversation?._id) {
            setUnreadCounts({
                ...unreadCounts,
                [selectedConversation._id]: 0
            });
        }
    }, [selectedConversation, setUnreadCounts]);

    return (
        <div className='flex-1 flex flex-col bg-[#e5ddd5]'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div className='bg-[#075E54] px-4 py-3 flex items-center gap-3'>
                        <div className='avatar online'>
                            <div className='w-10 rounded-full'>
                                <img src={selectedConversation.profilePic} alt='user avatar' />
                            </div>
                        </div>
                        <div>
                            <span className='text-white font-semibold text-lg'>{selectedConversation.fullName}</span>
                        </div>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};
export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className='flex items-center justify-center w-full h-full bg-[#e5ddd5]'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-700 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser.fullName}</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center text-gray-400' />
            </div>
        </div>
    );
};
