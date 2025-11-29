import { useState, FormEvent } from "react";
import { BsSend } from "react-icons/bs";
import { MdTranslate } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import useTranslate from "../../hooks/useTranslate";
import CreditExpiredModal from "../modals/CreditExpiredModal";

const MessageInput = () => {
    const [message, setMessage] = useState<string>("");
    const { loading, sendMessage } = useSendMessage();
    const { loading: translating, translate, showCreditModal, setShowCreditModal } = useTranslate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };

    const handleTranslate = async () => {
        if (!message) return;
        const translatedText = await translate(message);
        if (translatedText) {
            setMessage(translatedText);
        }
    };

    return (
        <form className='px-3 md:px-6 py-3 md:py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex-shrink-0' onSubmit={handleSubmit}>
            <div className='w-full relative flex gap-2 items-center'>
                <input
                    type='text'
                    className='flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800 placeholder-gray-400 text-sm md:text-base'
                    placeholder='Type a message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type='button'
                    className='p-2.5 md:p-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
                    onClick={handleTranslate}
                    disabled={translating || !message}
                    title="Translate to English"
                >
                    {translating ? (
                        <div className='loading loading-spinner loading-sm'></div>
                    ) : (
                        <MdTranslate className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                </button>
                <button
                    type='submit'
                    className='p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
                    disabled={loading || !message}
                    title="Send message"
                >
                    {loading ? (
                        <div className='loading loading-spinner loading-sm'></div>
                    ) : (
                        <BsSend className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                </button>
            </div>
            <CreditExpiredModal 
                isOpen={showCreditModal} 
                onClose={() => setShowCreditModal(false)} 
            />
        </form>
    );
};

export default MessageInput;

