import { useEffect, useState } from 'react';
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

    const formatDuration = (seconds) => {
        if (!seconds && seconds !== 0) return '0 min';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
        if (mins > 0) return `${mins}m`;
        return `${secs}s`;
    }

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4);
    }

    return (
        <div className="relative h-screen w-full bg-[#050308] text-gray-100 flex flex-col overflow-hidden z-0 font-sans">
            <BgGlowingEffect />

            {/* Header Section */}
            <header className="relative z-10 w-full flex items-center justify-between px-4 md:px-16 py-4 md:py-6 shrink-0 border-b border-white/5 bg-[#050308]/60 backdrop-blur-md">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 p-2.5 md:p-0 rounded-full md:rounded-none bg-white/5 md:bg-transparent border md:border-none border-white/10 text-gray-300 hover:text-[#f27e20] md:hover:text-white transition-all cursor-pointer shadow-md md:shadow-none"
                >
                    <ArrowLeft size={22} className="md:w-5 md:h-5" />
                    <span className="hidden md:inline font-medium text-base">Back to Home</span>
                </motion.button>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-white"
                >
                    Meeting <span className="text-[#f27e20]">History</span>
                </motion.h1>
                <div className="hidden md:block w-30"></div> {/* Spacer for alignment */}
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 w-full mx-auto px-4 md:px-6 py-6 md:py-10 overflow-y-auto">
                {!history || history.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center pt-20 text-gray-400 max-w-4xl mx-auto text-center"
                    >
                        <Video size={64} className="mb-4 text-white/20" />
                        <h2 className="text-xl font-medium text-gray-300">No meeting history found</h2>
                        <p className="mt-2 text-sm px-4">Join a meeting to see it listed here.</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-4 pb-8 max-w-4xl mx-auto">
                        {history.slice(0, visibleCount).map((meeting, index) => (
                            <motion.div
                                key={meeting._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: (index % 5) * 0.05 }}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#120e1a]/80 border border-white/10 rounded-xl p-4 sm:p-5 hover:border-[#f27e20]/50 transition-colors backdrop-blur-sm shadow-md w-full gap-4 sm:gap-0 cursor-pointer"
                            >
                                <div className="flex items-center gap-4 sm:gap-5 w-full">
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-[#f27e20]/20 flex items-center justify-center border border-[#f27e20]/30 text-[#f27e20]">
                                        <Video size={24} />
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-hidden">
                                        <h3 className="text-base sm:text-lg font-medium text-white mb-1 truncate">
                                            Code: <span className="text-gray-300 font-normal">{meeting.meetingCode}</span>
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-400">
                                            <span className="flex items-center gap-1.5 bg-white/5 sm:bg-transparent px-2.5 sm:px-0 py-1 sm:py-0 rounded-md">
                                                <Calendar size={14} />
                                                {formatDate(meeting.createdAt || meeting.date)}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-white/5 sm:bg-transparent px-2.5 sm:px-0 py-1 sm:py-0 rounded-md">
                                                <Clock size={14} />
                                                {formatTime(meeting.createdAt || meeting.date)}
                                            </span>
                                            {meeting.duration !== undefined && (
                                              <span className="flex items-center gap-1 bg-[#f27e20]/10 text-[#f27e20] px-2 py-0.5 rounded-full text-xs font-medium ml-1">
                                                  Dur: {formatDuration(meeting.duration)}
                                              </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/${meeting.meetingCode}`)}
                                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg bg-[#f27e20]/10 sm:bg-white/5 hover:bg-[#f27e20] text-[#f27e20] sm:text-gray-300 hover:text-white text-sm font-medium transition-all duration-200 border border-[#f27e20]/30 sm:border-white/10 hover:border-[#f27e20] cursor-pointer flex justify-center items-center"
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