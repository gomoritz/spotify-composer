import React from "react"
import { motion } from "motion/react"
import { authorizeAppleMusic } from "@/apple/music"

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
            className="bg-white border-gray-200 border-2 shadow-sm rounded-md py-2 px-5 text-black text-md cursor-pointer flex items-center gap-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={requestAuthorization}
        >
            Login with <b className="font-semibold text-red-600">Apple Music</b>
        </motion.div>
    )
}

export default AppleAuthorizationButton
