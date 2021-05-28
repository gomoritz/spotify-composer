import React from "react"
import { motion } from "framer-motion"
import constants from "@spotify/constants"

const AuthorizationButton: React.FC = () => {
    const requestAuthorization = () => {
        let link = "https://accounts.spotify.com/authorize" +
            "?client_id=" + constants.client_id +
            "&response_type=" + constants.response_type +
            "&redirect_uri=" + constants.redirect_uri +
            "&scope=" + constants.scopes

        if (process.env.REACT_APP_PREVIEW_ID)
            link += "&state=" + process.env.REACT_APP_PREVIEW_ID

        window.location.href = link
    }

    return (
        <motion.div className="bg-emerald-500 border-emerald-400 border-2 shadow-sm rounded-md py-2 px-5 text-white text-md cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestAuthorization}
        >
            Login with <b className="font-semibold">Spotify</b><br/>
        </motion.div>
    )
}

export default AuthorizationButton
