import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { MdTranslate } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import useTranslate from "../../hooks/useTranslate";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();
    const { loading: translating, translate } = useTranslate();

    const handleSubmit = async (e) => {
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
        <form className='px-4 my-3' onSubmit={handleSubmit}>
            <div className='w-full relative flex gap-2'>
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
                    placeholder='Send a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type='button'
                    className='btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none'
                    onClick={handleTranslate}
                    disabled={translating || !message}
                >
                    {translating ? (
                        <div className='loading loading-spinner loading-sm'></div>
                    ) : (
                        <MdTranslate className="w-5 h-5" />
                    )}
                </button>
                <button
                    type='submit'
                    className='btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none'
                    disabled={loading || !message}
                >
                    {loading ? <div className='loading loading-spinner loading-sm'></div> : <BsSend />}
                </button>
            </div>
        </form>
    );
};
export default MessageInput;
