import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState, FormEvent, ChangeEvent } from "react";
import useSignup from "../../hooks/useSignup";

interface SignupInputs {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: "" | "male" | "female";
}

const SignUp = () => {
    const [inputs, setInputs] = useState<SignupInputs>({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });

    const { loading, signup } = useSignup();

    const handleCheckboxChange = (gender: "male" | "female") => {
        setInputs({ ...inputs, gender });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signup(inputs);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-4 py-8'>
            <div className='w-full max-w-md'>
                <div className='bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                            Create Account
                        </h1>
                        <p className='text-gray-600'>Sign up to start chatting</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Full Name
                            </label>
                            <input
                                type='text'
                                name="fullName"
                                placeholder='John Doe'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Username
                            </label>
                            <input
                                type='text'
                                name="username"
                                placeholder='johndoe'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Email
                            </label>
                            <input
                                type='email'
                                name="email"
                                placeholder='john@example.com'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Password
                            </label>
                            <input
                                type='password'
                                name="password"
                                placeholder='Enter Password'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                name="confirmPassword"
                                placeholder='Confirm Password'
                                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-800'
                                value={inputs.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='py-2'>
                            <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
                        </div>

                        <div className='text-center'>
                            <Link 
                                to='/login' 
                                className='text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors'
                            >
                                Already have an account? <span className='font-semibold'>Sign in</span>
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
                                'Create Account'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

