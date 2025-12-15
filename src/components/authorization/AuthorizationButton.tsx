import React from "react"
import { motion } from "motion/react"
import constants from "@/spotify/constants"
import { getCodeChallenge } from "@/utils/pkce"

const AuthorizationButton: React.FC = () => {
    const requestAuthorization = async () => {
        window.location.href =
            "https://accounts.spotify.com/authorize" +
            "?client_id=" +
            constants.client_id +
            "&response_type=" +
            constants.response_type +
            "&redirect_uri=" +
            constants.redirect_uri +
            "&scope=" +
            constants.scopes +
            "&code_challenge_method=" +
            constants.code_challenge_method +
            "&code_challenge=" +
            (await getCodeChallenge())
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
