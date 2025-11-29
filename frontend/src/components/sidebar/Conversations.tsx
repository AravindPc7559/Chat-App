import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
    const { loading, conversations } = useGetConversations();

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {conversations.length === 0 && !loading && (
                <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
                    <p className='text-gray-500 text-sm'>
                        No conversations yet
                    </p>
                    <p className='text-gray-400 text-xs mt-1'>
                        Start a new conversation to begin chatting
                    </p>
                </div>
            )}
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === conversations.length - 1}
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

export default Conversations;

