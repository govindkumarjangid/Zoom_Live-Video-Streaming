import { useState } from 'react'
import WithAuth from '../utils/WithAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import BgGlowingEffect from '../components/BgGlowingEffect';
import { useHistory } from '../context/HistoryContext.jsx';

const Home = () => {

  const [meetingCode, setMeetingCode] = useState('');

  const navigate = useNavigate();

  const { addToHistory } = useHistory();

  let handleJoinVideoCall = async () => {
    await addToHistory(meetingCode);
    navigate(`/${meetingCode}`);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/authentication");
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050308] text-gray-100 flex flex-col overflow-hidden z-0 font-sans">

      <BgGlowingEffect />

      {/* Navbar Section */}
      <header className="relative z-10 w-full flex items-center justify-between px-8 md:px-16 py-6 shrink-0">
        {/* Top Left: Logo / Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: -50, blur: "10px" }}
          animate={{ opacity: 1, y: 0, blur: "0px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-xl font-semibold tracking-wide text-gray-100">
          Apna Video Call
        </motion.div>

        {/* Top Right: History and Logout */}
        <motion.div
          initial={{ opacity: 0, y: -50, blur: "10px" }}
          animate={{ opacity: 1, y: 0, blur: "0px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-150 active:scale-95 text-sm font-medium cursor-pointer">
            <Clock size={18} />
            History
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-all duration-150 active:scale-95 cursor-pointer text-sm font-medium">
            <LogOut size={18} />
            LOGOUT
          </button>
        </motion.div>
      </header>

      {/* Main Content Section */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-8 md:px-24">

        {/* Left Column: Text and Input Form */}
        <div className="w-full md:w-1/2 flex flex-col items-start space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 50, blur: "10px" }}
            animate={{ opacity: 1, y: 0, blur: "0px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-semibold leading-tight max-w-lg text-gray-100">
            Providing Quality <span className="text-[#f27e20]">Video Calls</span> Just Like Quality Education
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 50, blur: "10px" }}
            animate={{ opacity: 1, y: 0, blur: "0px" }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex items-center gap-3 w-full max-w-md mt-4">
            <input
              type="text"
              placeholder="Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="w-full bg-[#120e1a] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f27e20]/50 focus:border-[#f27e20] transition-colors"
            />
            <button
              onClick={handleJoinVideoCall}
              className="bg-[#f27e20] hover:bg-[#d96c16] text-white font-medium px-8 py-3 rounded-md transition-all duration-100 hover:scale-105 active:scale-97 shadow-lg cursor-pointer">
              JOIN
            </button>
          </motion.div>
        </div>

        {/* Right Column: Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, x: 50, blur: "10px" }}
            animate={{ opacity: 1, x: 0, blur: "0px" }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-sm">
            <img
              src="/illustration.png"
              alt="Video Call Illustration"
              className="w-100 h-100 rounded-full object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </div>

      </main>
    </div>
  )
}

export default WithAuth(Home);