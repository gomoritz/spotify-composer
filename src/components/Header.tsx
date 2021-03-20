import React from "react"
import useAsync from "../utils/useAsync"
import { getProfile } from "../spotify/profile"

interface Props {

}

const Header: React.FC<Props> = () => {
    const { state, result: profile } = useAsync(getProfile)

    const buttonText = state === "done" && profile?.display_name ? profile.display_name
        : state === "computing" ? "Loading..."
            : "Login with Spotify"

    return (
        <div className="w-full flex justify-between items-center
        max-w-screen-xl mx-auto py-3 px-7 bg-emerald-500 shadow-sm">
            <div>
                <p className="text-xl font-bold tracking-tight text-white m-0 p-0">
                    Spotify Playlist Composer
                </p>
                <p className="text-sm font-normal tracking-tight text-white opacity-75 -mt-1">
                    by Inception Cloud
                </p>
            </div>
            <p className="bg-white px-3 py-1 rounded-md">
                {buttonText}
            </p>
        </div>
    )
}

export default Header