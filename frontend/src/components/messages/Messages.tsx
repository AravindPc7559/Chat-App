import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className='px-3 md:px-6 py-4 flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-indigo-50/30 min-h-0'>
            {!loading &&
                messages.length > 0 &&
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef} className="mb-2">
                        <Message message={message} />
                    </div>
                ))}

            {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
            {!loading && messages.length === 0 && (
                <div className='flex items-center justify-center h-full min-h-[200px]'>
                    <p className='text-center text-gray-500 font-medium'>No messages yet. Start the conversation! 💬</p>
                </div>
            )}
        </div>
    );
};

export default Messages;

