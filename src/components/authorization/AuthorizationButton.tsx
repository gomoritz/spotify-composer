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
            "&redirect_uri=" + constants.redirect_uri +
            "&scope=" + constants.scopes
    }

    return (
        <motion.div className="bg-green-500 text-white text-md rounded-md py-2 px-5 shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: "#4ADE80" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestAuthorization}
        >
            Login with <b className="font-semibold">Spotify</b>
        </motion.div>
    )
}

export default AuthorizationButton