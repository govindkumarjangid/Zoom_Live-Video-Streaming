import { motion } from 'framer-motion';
import { MicOff, Video, PhoneOff, Settings, FlipHorizontal, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Hero = () => {

    const naviagte = useNavigate();
    const { setFormState } = useAuth();
    const [meetingCode, setMeetingCode] = useState('');

    const handleJoinAsGuest = () => {
        if (!meetingCode.trim()) {
            toast.error('Please enter a meeting code first', {
                style: {
                    borderRadius: '10px',
                    background: '#32303A',
                    color: '#f1f2f3',
                    border: '1px solid #f27e20',
                },
            });
            return;
        }
        naviagte(`/${meetingCode}`);
    };

    return (
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 flex flex-1 gap-6 md:gap-12 items-center justify-center flex-col-reverse md:flex-row h-full pb-8 md:py-0 overflow-hidden">

            {/* Left Column*/}
            <div className="flex flex-col items-start space-y-6 md:w-1/2 w-full "
            >
                <motion.h1
                    initial={{ opacity: 0, y: 50, blur: "10px" }}
                    animate={{ opacity: 1, y: 0, blur: "0px" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="text-4xl md:text-5xl font-semibold leading-tight text-gray-100"
                >
                    Seamless <span className="text-[#f27e20]">Video Calls</span> <br />
                    Anywhere, Anytime
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 50, blur: "10px" }}
                    animate={{ opacity: 1, y: 0, blur: "0px" }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="text-gray-400 text-lg md:text-xl max-w-lg"
                >
                    Experience high-definition video meetings with crystal-clear audio. Bridge the distance instantly with secure, reliable connections for your friends, family, and teams.
                </motion.p>

                <div className="flex flex-col w-full max-w-md gap-4 mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50, blur: "10px" }}
                        animate={{ opacity: 1, y: 0, blur: "0px" }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-3 w-full"
                    >
                        <input
                            type="text"
                            placeholder="Enter Meeting Code"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoinAsGuest()}
                            className="w-full sm:flex-1 bg-[#120e1a] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f27e20]/50 focus:border-[#f27e20] transition-colors"
                        />
                        <button
                            onClick={handleJoinAsGuest}
                            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/10 cursor-pointer whitespace-nowrap"
                        >
                            Join as Guest
                        </button>
                    </motion.div>

                    <motion.div className="flex items-center gap-4 w-full">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-gray-500 text-sm font-medium">OR</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </motion.div>

                    <motion.button
                        onClick={() => {
                            setFormState('register');
                            naviagte('/authentication');
                        }}
                        initial={{ opacity: 0, y: 50, blur: "10px" }}
                        animate={{ opacity: 1, y: 0, blur: "0px" }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="w-full bg-[#f27e20] hover:bg-[#d96c16] text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        Get Started Free
                    </motion.button>
                </div>
            </div>

            {/* Right Column: Phone Mockups */}
            <div className="relative h-full w-full md:w-1/2 flex justify-center items-center perspective-1000 scale-[0.65] sm:scale-75 md:scale-[0.85] lg:scale-100 origin-center md:origin-right lg:origin-center sm:mt-0">

                {/* Back Phone (Right) */}
                <motion.div
                    initial={{ opacity: 0, x: 100, rotate: 15 }}
                    animate={{ opacity: 1, x: 40, rotate: 8 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="absolute z-0 w-60 h-125 rounded-[2.5rem] bg-gray-900 border-4 border-gray-800 shadow-2xl overflow-hidden"
                >
                    <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop" alt="Video caller 2"
                        className="w-full h-full object-cover"
                    />

                    {/* Phone notch */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 w-1/2 mx-auto rounded-b-2xl" />

                    {/* Overlay controls */}
                    <div className="absolute bottom-6 inset-x-4 bg-black/60 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/10">
                        <div className="flex flex-col items-center gap-1">
                            <MicOff size={16} className="text-gray-300" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Video size={16} className="text-gray-300" />
                        </div>
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                            <PhoneOff size={18} className="text-white" />
                        </div>
                    </div>

                </motion.div>

                {/* Front Phone (Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -100, y: 50, rotate: -15 }}
                    animate={{ opacity: 1, x: -60, y: 20, rotate: -6 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute z-10 w-65 h-135 rounded-[2.5rem] bg-black border-[6px] border-gray-800 shadow-2xl overflow-hidden"
                >
                    <motion.div className="w-full h-full relative">
                        <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop" alt="Video caller 1"
                            className="w-full h-full object-cover"
                        />

                        {/* Caller Info */}
                        <div className="absolute top-8 left-4 flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="avatar" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold leading-tight">John Smith</p>
                                <p className="text-[10px] text-gray-300">02:45</p>
                            </div>
                        </div>

                        {/* Phone notch */}
                        <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 w-1/2 mx-auto rounded-b-3xl" />

                        {/* Overlay controls - Detailed */}
                        <div className="absolute bottom-8 inset-x-4 bg-[#1e1e1e]/90 backdrop-blur-xl rounded-3xl p-4 border border-white/10 flex flex-col gap-4">
                            <div className="flex justify-between items-center px-2">
                                <button className="p-2 rounded-full hover:bg-white/10 transition">
                                    <Settings size={20} className="text-gray-300" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-white/10 transition">
                                    <MicOff size={20} className="text-gray-300" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-white/10 transition">
                                    <FlipHorizontal size={20} className="text-gray-300" />
                                </button>
                                <button className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                                    <PhoneOff size={20} className="text-white" />
                                </button>
                            </div>
                            <div className="flex justify-between gap-2 px-4 text-xs text-gray-400">
                                <button className="flex items-center gap-1 hover:text-white transition">
                                    <Video size={12} /> Camera Off</button>
                                <button className="flex items-center gap-1 hover:text-white transition">
                                    <Volume2 size={12} /> Speaker</button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </main>
    )
}

export default Hero;