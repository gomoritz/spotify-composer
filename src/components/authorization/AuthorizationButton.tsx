import React from "react"
import { motion } from "motion/react"
import { authorizeSpotify } from "@/spotify/authorization"

const AuthorizationButton: React.FC = () => {
    const requestAuthorization = async () => {
        await authorizeSpotify()
    }

    return (
        <motion.div
            className="bg-purple-600 border-purple-500 border-2 shadow-sm rounded-md py-2 px-5 text-white text-md cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={requestAuthorization}
        >
            Login with <b className="font-semibold">Spotify</b>
            <br />
        </motion.div>
    )
}

export default AuthorizationButton
