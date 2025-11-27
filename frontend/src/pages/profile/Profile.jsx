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
            <div className='w-full max-w-2xl p-6 sm:p-8 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                <div className="flex items-center justify-between mb-6">
                    <h1 className='text-2xl sm:text-3xl font-semibold text-gray-300'>
                        Profile
                    </h1>
                    <Link to='/' className='btn btn-sm btn-ghost text-gray-300'>
                        Back to Chat
                    </Link>
                </div>

                <div className='flex flex-col sm:flex-row items-center gap-6 mb-8'>
                    <div className='avatar'>
                        <div className='w-24 sm:w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                            <img src={authUser.profilePic} alt='profile' />
                        </div>
                    </div>
                    <div className='text-center sm:text-left'>
                        <h2 className='text-xl sm:text-2xl font-bold text-gray-200'>{authUser.fullName}</h2>
                        <p className='text-gray-400'>@{authUser.username}</p>
                        <p className='text-gray-400'>{authUser.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Full Name</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Full Name'
                            className='w-full input input-bordered h-10'
                            value={inputs.fullName}
                            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Username</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Username'
                            className='w-full input input-bordered h-10 bg-gray-700'
                            value={inputs.username}
                            disabled
                        />
                        <label className='label'>
                            <span className='text-xs label-text-alt text-gray-400'>Username cannot be changed</span>
                        </label>
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Email</span>
                        </label>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full input input-bordered h-10'
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Profile Picture URL</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Profile Picture URL'
                            className='w-full input input-bordered h-10'
                            value={inputs.profilePic}
                            onChange={(e) => setInputs({ ...inputs, profilePic: e.target.value })}
                        />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2'>
                        <button type='submit' className='btn btn-primary flex-1' disabled={loading}>
                            {loading ? <span className='loading loading-spinner'></span> : "Save Changes"}
                        </button>
                        <button
                            type='button'
                            className='btn btn-ghost flex-1'
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
    );
};

export default Profile;
