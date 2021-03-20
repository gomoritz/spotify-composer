import React from "react"
import { motion } from "framer-motion"
import constants from "../../spotify/constants"

interface Props {

}

const AuthorizationButton: React.FC<Props> = () => {
    const requestAuthorization = () => {
        window.location.href = "https://accounts.spotify.com/authorize" +
            "?client_id=" + constants.client_id +
            "&response_type=" + constants.response_type +
            "&redirect_uri=" + constants.redirect_uri
    }

    return (
        <motion.div className="bg-gradient-to-br from-green-400 to-green-500
                    text-white text-md rounded-md py-2 px-5 shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestAuthorization}
        >
            Login with <b className="font-semibold">Spotify</b>
        </motion.div>
    )
}

export default AuthorizationButton