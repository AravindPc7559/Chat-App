import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import { Link } from "react-router-dom";

const Profile = () => {
    const { authUser } = useAuthContext();
    const [inputs, setInputs] = useState({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        profilePic: authUser.profilePic,
    });

    const { loading, updateProfile } = useUpdateProfile();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(inputs);
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-4 py-8'>
            <div className='w-full max-w-2xl'>
                <div className='bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10'>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                            Profile Settings
                        </h1>
                        <Link 
                            to='/' 
                            className='px-4 py-2 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all font-medium'
                        >
                            ← Back
                        </Link>
                    </div>

                    <div className='flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200'>
                        <div className='relative'>
                            <div className='w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden ring-4 ring-indigo-200 ring-offset-4 ring-offset-white shadow-lg'>
                                <img src={authUser.profilePic} alt='profile' className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className='text-center sm:text-left'>
                            <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1'>{authUser.fullName}</h2>
                            <p className='text-gray-600 mb-1'>@{authUser.username}</p>
                            <p className='text-gray-500 text-sm'>{authUser.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Full Name
                            </label>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.fullName}
                                onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Username
                            </label>
                            <input
                                type='text'
                                placeholder='Username'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed'
                                value={inputs.username}
                                disabled
                            />
                            <p className='text-xs text-gray-500 mt-1'>Username cannot be changed</p>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Email
                            </label>
                            <input
                                type='email'
                                placeholder='Email'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Profile Picture URL
                            </label>
                            <input
                                type='text'
                                placeholder='Profile Picture URL'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.profilePic}
                                onChange={(e) => setInputs({ ...inputs, profilePic: e.target.value })}
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                            <button 
                                type='submit' 
                                className='flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed' 
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className='loading loading-spinner'></span>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button
                                type='button'
                                className='flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all'
                                onClick={() => {
                                    setInputs({
                                        fullName: authUser.fullName,
                                        username: authUser.username,
                                        email: authUser.email,
                                        profilePic: authUser.profilePic,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
