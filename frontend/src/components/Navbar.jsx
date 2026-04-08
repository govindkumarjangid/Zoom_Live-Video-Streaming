import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../context/AuthContext";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {

    const naviagte = useNavigate();
    const { setFormState } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="relative z-50 w-full flex items-center justify-between px-4 sm:px-8 md:px-16 py-4 md:py-6 shrink-0">
            <motion.div
                initial={{ opacity: 0, y: -50, blur: "10px" }}
                animate={{ opacity: 1, y: 0, blur: "0px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="text-xl font-semibold tracking-wide text-gray-100">
                Apna Video Call
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -50, blur: "10px" }}
                animate={{ opacity: 1, y: 0, blur: "0px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="hidden md:flex items-center space-x-6 text-base">
                <button
                    onClick={() => {
                        naviagte('/authentication');
                        setFormState('register');
                    }}
                    className="text-gray-300 transition-all duration-100 hover:scale-105 active:scale-97 cursor-pointer">Register</button>
                <button
                    onClick={() => {
                        naviagte('/authentication');
                        setFormState('login');
                    }}
                    className="bg-[#f27e20] hover:bg-[#d96c16] text-white px-5 py-1 rounded-md font-medium shadow-lg transition-all duration-100 hover:scale-105 active:scale-97 cursor-pointer">
                    Login
                </button>
            </motion.div>

            {/* Mobile Menu Toggle Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden z-50 p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
            >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 mx-4 p-4 rounded-xl bg-[#120e1a]/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-4 md:hidden z-9999"
                    >
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                naviagte('/authentication');
                                setFormState('register');
                            }}
                            className="w-full py-3 text-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer font-medium"
                        >
                            Register
                        </button>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                naviagte('/authentication');
                                setFormState('login');
                            }}
                            className="w-full py-3 text-center text-white bg-[#f27e20] hover:bg-[#d96c16] rounded-lg shadow-lg transition-colors cursor-pointer font-medium"
                        >
                            Login
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar;
