import React from "react"
import { motion } from "motion/react"
import { authorizeSpotify } from "@/spotify/authorization"
import { FaSpotify } from "react-icons/fa"

const AuthorizationButton: React.FC = () => {
    const requestAuthorization = async () => {
        await authorizeSpotify()
    }

    return (
        <motion.div
            className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white py-3 px-8 rounded-full font-bold text-lg shadow-lg cursor-pointer transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={requestAuthorization}
        >
            <FaSpotify size={24} />
            Connect Spotify
        </motion.div>
    )
}

export default AuthorizationButton
