import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    return (
        <div className='w-full'>
            {!loading ? (
                <button
                    className='flex items-center justify-center gap-2 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 font-medium hover:shadow-md'
                    onClick={logout}
                >
                    <BiLogOut className='w-5 h-5' />
                    <span>Logout</span>
                </button>
            ) : (
                <div className='flex items-center justify-center'>
                    <span className='loading loading-spinner text-red-600'></span>
                </div>
            )}
        </div>
    );
};

export default LogoutButton;

