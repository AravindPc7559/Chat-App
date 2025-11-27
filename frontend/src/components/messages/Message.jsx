import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-[#DCF8C6] text-gray-800" : "bg-white text-gray-800";
    const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <div className={`chat ${chatClassName} px-4`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='User avatar' src={profilePic} />
                </div>
            </div>
            <div className={`chat-bubble ${bubbleBgColor} ${shakeClass} shadow-sm max-w-[70%]`}>
                {message.message}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center mt-1'>
                <time className="text-xs opacity-50">{formattedTime}</time>
            </div>
        </div>
    );
};
export default Message;
