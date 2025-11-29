import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { Message as MessageType, User } from "../../types";

interface MessageProps {
    message: MessageType;
}

const Message = ({ message }: MessageProps) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const isGroup = selectedConversation?.type === "group";
    
    // Check if message is from current user
    // Convert both to strings to handle ObjectId instances from MongoDB
    // Handle populated senderId (object with _id) or plain ObjectId
    let senderIdValue: string;
    if (typeof message.senderId === 'object' && message.senderId !== null) {
        // If senderId is populated (has _id property), use that
        if ('_id' in message.senderId && message.senderId._id) {
            senderIdValue = String(message.senderId._id);
        } else if ('toString' in message.senderId) {
            // If it's an ObjectId instance, convert to string
            senderIdValue = String(message.senderId);
        } else {
            // Fallback: try to get id from object
            senderIdValue = String((message.senderId as any).id || message.senderId);
        }
    } else {
        senderIdValue = String(message.senderId);
    }
    const fromMe = senderIdValue === String(authUser._id);
    const formattedTime = extractTime(message.createdAt);
    
    // Get profile pic - for groups, use sender's pic, for direct messages use conversation partner's pic
    let profilePic: string | null = null;
    if (fromMe) {
        profilePic = authUser.profilePic;
    } else if (isGroup && message.senderId) {
        // For group messages, use sender's profile pic
        profilePic = typeof message.senderId === 'object' ? message.senderId.profilePic : null;
    } else {
        profilePic = selectedConversation?.profilePic || null;
    }
    
    // Get sender name for group messages
    const senderName = isGroup && !fromMe && message.senderId 
        ? (typeof message.senderId === 'object' ? message.senderId.fullName : null)
        : null;
    
    const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <div className={`flex gap-2 items-end mb-1 ${fromMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!fromMe && (
                <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white'>
                    {profilePic ? (
                        <img alt='User avatar' src={profilePic} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                {senderName?.[0]?.toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>
            )}
            <div className={`flex flex-col ${fromMe ? 'items-end' : 'items-start'} max-w-[75%] md:max-w-[65%]`}>
                {isGroup && !fromMe && senderName && (
                    <span className="text-xs text-gray-600 font-medium mb-1 px-2">{senderName}</span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl ${fromMe 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                } ${shakeClass}`}>
                    <p className="text-sm md:text-base break-words">{message.message}</p>
                </div>
                <span className={`text-xs text-gray-500 mt-1 px-2 ${fromMe ? 'text-right' : 'text-left'}`}>
                    {formattedTime}
                </span>
            </div>
            {fromMe && (
                <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white'>
                    <img alt='User avatar' src={profilePic || ''} className="w-full h-full object-cover" />
                </div>
            )}
        </div>
    );
};

export default Message;

