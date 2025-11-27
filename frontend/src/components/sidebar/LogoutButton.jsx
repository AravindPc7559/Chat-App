import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    return (
        <div className='w-full'>
            {!loading ? (
                <button
                    className='flex items-center gap-2 w-full p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors'
                    onClick={logout}
                >
                    <BiLogOut className='w-6 h-6' />
                    <span className='font-semibold'>Logout</span>
                </button>
            ) : (
                <span className='loading loading-spinner text-red-600'></span>
            )}
        </div>
    );
};
export default LogoutButton;
