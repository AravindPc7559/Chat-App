import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { IoArrowBack } from "react-icons/io5";

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
    }, [selectedConversation?._id, setUnreadCounts]);

    const handleBack = () => {
        setSelectedConversation(null);
    };

    return (
        <div className='flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/30 h-full min-h-0'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-4 md:px-6 py-4 flex items-center gap-3 shadow-lg flex-shrink-0'>
                        <button
                            onClick={handleBack}
                            className='md:hidden p-2 rounded-lg hover:bg-white/20 text-white transition-colors'
                            aria-label="Back to conversations"
                        >
                            <IoArrowBack className='w-6 h-6' />
                        </button>
                        <div className='relative'>
                            <div className='w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center'>
                                {selectedConversation.type === "group" ? (
                                    selectedConversation.groupPic ? (
                                        <img src={selectedConversation.groupPic} alt='group avatar' className="w-full h-full object-cover" />
                                    ) : (
                                        <span className='text-white font-bold text-lg'>{selectedConversation.name?.[0]?.toUpperCase()}</span>
                                    )
                                ) : (
                                    <>
                                        <img src={selectedConversation.profilePic} alt='user avatar' className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <span className='text-white font-semibold text-lg truncate block'>
                                {selectedConversation.type === "group" ? selectedConversation.name : selectedConversation.fullName}
                            </span>
                            {selectedConversation.type === "group" && (
                                <span className='text-white/80 text-xs truncate block'>{selectedConversation.members?.length || 0} members</span>
                            )}
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
        <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-indigo-50/30'>
            <div className='px-4 text-center flex flex-col items-center gap-4'>
                <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl'>
                    <TiMessages className='text-5xl md:text-7xl text-white' />
                </div>
                <div className='space-y-2'>
                    <p className='text-xl md:text-2xl font-bold text-gray-800'>Welcome, {authUser.fullName}! 👋</p>
                    <p className='text-sm md:text-base text-gray-600'>Select a conversation from the sidebar to start messaging</p>
                </div>
            </div>
        </div>
    );
};
