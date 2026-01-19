import React from "react"
import { motion } from "motion/react"
import { authorizeAppleMusic } from "@/apple/music"
import { FaApple } from "react-icons/fa"

const AppleAuthorizationButton: React.FC = () => {
    const requestAuthorization = async () => {
        try {
            await authorizeAppleMusic()
            window.location.reload() // Reload to refresh authorization status in Page
        } catch (error) {
            console.error("Apple Music authorization failed:", error)
        }
    }

    return (
        <motion.div
            className="flex items-center gap-3 bg-[#ff0436] hover:bg-[#ff3b55] text-white py-3 px-8 rounded-full font-bold text-lg shadow-lg cursor-pointer transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={requestAuthorization}
        >
            <FaApple size={24} />
            Connect Apple Music
        </motion.div>
    )
}

export default AppleAuthorizationButton
