"use client"

import React from "react"
import useAsync from "@/utils/useAsync"
import { getProfile } from "@/spotify/profile"

interface Props {}

const Header: React.FC<Props> = () => {
    const { state, result: profile } = useAsync(getProfile)

    const buttonText =
        state === "done" && profile?.display_name
            ? profile.display_name
            : state === "computing"
            ? "Loading..."
            : "Login with Spotify"

    function reload() {
        const url = new URL(window.location.href)
        url.pathname = ""
        url.hash = ""
        url.search = ""
        window.location.replace(url.toString())
    }

    return (
        <div className="w-full bg-emerald-500 shadow-md z-50">
            <div className="w-full flex justify-between items-center py-3 px-7 max-w-screen-lg mx-auto">
                <div className="whitespace-nowrap flex-nowrap">
                    <p
                        className="text-xl font-bold tracking-tight text-white m-0 p-0 cursor-pointer"
                        onClick={reload}
                    >
                        Spotify Composer
                    </p>
                    <p className="text-sm font-normal tracking-tight text-white opacity-75 -mt-1">
                        by{" "}
                        <a href="https://goessl.me" className="underline">
                            inception
                        </a>
                    </p>
                </div>
                <p className="bg-white px-3 py-1 rounded-md truncate ml-8">{buttonText}</p>
            </div>
        </div>
    )
}

export default Header
