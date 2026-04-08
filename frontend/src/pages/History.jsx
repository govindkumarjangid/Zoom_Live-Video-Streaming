import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Calendar, Clock, ChevronDown } from 'lucide-react';
import BgGlowingEffect from '../components/BgGlowingEffect';
import { useHistory } from '../context/HistoryContext';
import WithAuth from '../utils/WithAuth';

const History = () => {

    const navigate = useNavigate();
    const { history, getHistory } = useHistory();
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        getHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4);
    }

    return (
        <div className="relative h-screen w-full bg-[#050308] text-gray-100 flex flex-col overflow-hidden z-0 font-sans">
            <BgGlowingEffect />

            {/* Header Section */}
            <header className="relative z-10 w-full flex items-center justify-between px-8 md:px-16 py-6 shrink-0 border-b border-white/5 bg-[#050308]/60 backdrop-blur-md">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </motion.button>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-2xl font-semibold tracking-wide text-white"
                >
                    Meeting <span className="text-[#f27e20]">History</span>
                </motion.h1>
                <div className="w-24"></div> {/* Spacer for alignment */}
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 w-full mx-auto px-6 py-10 overflow-y-auto">
                {!history || history.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center pt-20 text-gray-400 max-w-4xl mx-auto"
                    >
                        <Video size={64} className="mb-4 text-white/20" />
                        <h2 className="text-xl font-medium text-gray-300">No meeting history found</h2>
                        <p className="mt-2 text-sm">Join a meeting to see it listed here.</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-4 pb-8 max-w-4xl mx-auto">
                        {history.slice(0, visibleCount).map((meeting, index) => (
                            <motion.div
                                key={meeting._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: (index % 5) * 0.05 }}
                                className="flex items-center justify-between bg-[#120e1a]/80 border border-white/10 rounded-xl p-5 hover:border-[#f27e20]/50 transition-colors backdrop-blur-sm shadow-md w-full cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-full bg-[#f27e20]/20 flex items-center justify-center border border-[#f27e20]/30 text-[#f27e20]">
                                        <Video size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-medium text-white mb-1">
                                            Code: <span className="text-gray-300 font-normal">{meeting.meetingCode}</span>
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {formatDate(meeting.createdAt || meeting.date)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {formatTime(meeting.createdAt || meeting.date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/${meeting.meetingCode}`)}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-[#f27e20] text-gray-300 hover:text-white text-sm font-medium transition-all duration-200 border border-white/10 hover:border-[#f27e20] cursor-pointer"
                                >
                                    Rejoin
                                </button>
                            </motion.div>
                        ))}

                        {visibleCount < history.length && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center mt-6"
                            >
                                <button
                                    onClick={handleLoadMore}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#120e1a] hover:bg-[#f27e20]/10 border border-white/10 hover:border-[#f27e20]/50 text-gray-300 hover:text-white transition-all duration-200 cursor-pointer"
                                >
                                    <span>Load More</span>
                                    <ChevronDown size={18} />
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default WithAuth(History);