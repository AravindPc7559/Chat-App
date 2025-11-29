import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
    const { selectedConversation } = useConversation();

    return (
        <div className='flex items-center justify-center h-screen w-full overflow-hidden p-0 md:p-4'>
            <div className='flex flex-col md:flex-row w-full h-full md:h-[calc(100vh-2rem)] max-w-6xl mx-auto bg-white/95 backdrop-blur-xl shadow-2xl rounded-none md:rounded-2xl overflow-hidden'>
                {/* Sidebar - hidden on mobile when conversation is selected */}
                <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-shrink-0 h-full`}>
                    <Sidebar />
                </div>
                {/* Chat Container - hidden on mobile when no conversation is selected */}
                <div className={`${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 h-full`}>
                    <MessageContainer />
                </div>
            </div>
        </div>
    );
};
export default Home;
