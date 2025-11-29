import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { loading, login } = useLogin();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-4 py-8'>
            <div className='w-full max-w-md'>
                <div className='bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                            Welcome Back
                        </h1>
                        <p className='text-gray-600'>Sign in to continue to ChatHub</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Username
                            </label>
                            <input
                                type='text'
                                placeholder='Enter your username'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Password
                            </label>
                            <input
                                type='password'
                                placeholder='Enter your password'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='text-center'>
                            <Link 
                                to='/signup' 
                                className='text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors'
                            >
                                Don't have an account? <span className='font-semibold'>Sign up</span>
                            </Link>
                        </div>

                        <button 
                            type='submit'
                            className='w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed' 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='loading loading-spinner'></span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

