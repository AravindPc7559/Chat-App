import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
    return (
        <div className='flex h-screen w-full sm:h-[95vh] sm:max-w-[1400px] sm:rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 sm:border border-gray-100/20 sm:shadow-2xl'>
            <Sidebar />
            <MessageContainer />
        </div>
    );
};
export default Home;
