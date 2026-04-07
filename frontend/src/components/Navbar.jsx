import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <header className="relative z-10 w-full flex items-center justify-between px-8 md:px-16 py-6 shrink-0">
            <motion.div
                initial={{ opacity: 0, y: -50, blur: "10px" }}
                animate={{ opacity: 1, y: 0, blur: "0px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="text-xl font-semibold tracking-wide text-gray-100">
                Apna Video Call
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: -50, blur: "10px" }}
                animate={{ opacity: 1, y: 0, blur: "0px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="flex items-center space-x-6 text-base">
                <Link to="#" className="text-gray-300 transition-all duration-100 hover:scale-105 active:scale-97">Join as Guest</Link>
                <Link to="/register" className="text-gray-300 transition-all duration-100 hover:scale-105 active:scale-97">Register</Link>
                <Link to="/login" className="bg-[#f27e20] hover:bg-[#d96c16] text-white px-5 py-1 rounded-md font-medium shadow-lg transition-all duration-100 hover:scale-105 active:scale-97 cursor-pointer">
                    Login
                </Link>

            </motion.div>
        </header>
    )
}

export default Navbar;
