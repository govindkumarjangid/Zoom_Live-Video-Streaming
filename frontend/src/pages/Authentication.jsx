import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, User, LogIn, Loader, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Authentication = () => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
    });

    const { formState, setFormState, toastStyle } = useAuth();
    const naviagte = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const payload = formState === 'login' ? {
                username: formData.username,
                password: formData.password,
            } : formData;

            const endpoint = formState === 'login' ? '/users/login' : '/users/register';
            const { data } = await axiosInstance.post(endpoint, payload);

            const { message, user } = data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', data.token);
            toast.success(message, toastStyle);
            naviagte('/home');
        } catch (error) {
            console.log("Error : ", error);
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.', toastStyle);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-[#050308] text-white overflow-y-hidden relative">

            {/* Left Side: Image */}

            <div className="hidden md:flex md:w-1/2 relative bg-gray-900">
                <img
                    src={formState === 'login' ? './login.avif' : './register.avif'}
                    alt="authentication image"
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end pb-20 px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-xl"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            {formState === 'login' ? 'Connect Worldwide' : 'Start Your Journey'}
                        </h2>
                        <p className="text-gray-300 text-lg">
                            {formState === 'login'
                                ? 'Join your team, family, and friends with crystal-clear video calling anywhere, anytime.'
                                : 'Create an account to host limitless, high-quality video meetings with anyone around the globe.'}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">

                {/* Background Glows matching the Hero theme */}
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(120,60,210,0.15)_0%,transparent_80%)] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(242,126,32,0.15)_0%,transparent_80%)] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Header */}
                    <div className="mb-10 text-center md:text-left">
                        <div className="flex items-center justify-between gap-4 mb-8">
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => naviagte('/')}
                                className="flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                            >
                                <ArrowLeft size={20} />
                            </motion.button>
                            <Link to="/" className="text-[#f27e20] text-2xl font-bold tracking-wide hover:text-white transition-colors">
                                Apna Video Call
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {formState === 'login' ? 'Welcome Back!' : 'Create an Account'}
                        </h1>
                        <p className="text-gray-400">
                            {formState === 'login'
                                ? 'Please enter your details to sign in.'
                                : 'Join us and experience the best video calls.'}
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        {/* Full Name Input */}
                        {
                            formState === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className="w-full bg-[#120e1a] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f27e20]/50 focus:border-[#f27e20] transition-colors"
                                        />
                                    </div>
                                </div>
                            )
                        }

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter your username"
                                    className="w-full bg-[#120e1a] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f27e20]/50 focus:border-[#f27e20] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full bg-[#120e1a] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f27e20]/50 focus:border-[#f27e20] transition-colors"

                                />
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#f27e20] hover:bg-[#d96c16] text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 shadow-lg shadow-orange-500/20 transition-all duration-200 focus:scale-105 active:scale-99 cursor-pointer mt-4"
                        >
                            {loading ? (
                                <Loader size={20} className="animate-spin" />
                            ) : formState === 'login' ? (
                                <LogIn size={20} />
                            ) : (
                                <UserPlus size={20} />
                            )}

                            {/* Text Logic */}
                            {loading ? 'Please wait...' : formState === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>

                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-gray-400">
                        {
                            formState === 'login'
                                ? "Don't have an account ?"
                                : "Already have an account ?"
                        }
                        <Link className="text-[#f27e20] hover:text-[#d96c16] font-medium transition-colors">
                            {
                                formState === 'login'
                                    ? <span onClick={() => setFormState('register')}> Sign up</span>
                                    : <span onClick={() => setFormState('login')}> Sign in</span>
                            }
                        </Link>
                    </p>
                </motion.div>
            </div>

        </div>
    )
}

export default Authentication;