"use client"

import React, { useState, useEffect, useRef } from "react"
import useAsync from "@/utils/useAsync"
import { getProfile } from "@/spotify/profile"
import { isAppleMusicAuthorized, authorizeAppleMusic, initMusicKit } from "@/apple/music"
import { authorizeSpotify } from "@/spotify/authorization"
import { motion, AnimatePresence } from "motion/react"
import { FaChevronDown, FaSpotify, FaApple, FaCheckCircle } from "react-icons/fa"

interface Props {}

const Header: React.FC<Props> = () => {
    const { state: spotifyState, result: profile } = useAsync(getProfile)
    const [appleAuthorized, setAppleAuthorized] = useState<boolean>(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkAppleAuth = async () => {
            try {
                await initMusicKit()
                setAppleAuthorized(isAppleMusicAuthorized())
            } catch (e) {
                console.error("Failed to check Apple Music auth", e)
            }
        }
        checkAppleAuth()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const isSpotifyAuthorized = spotifyState === "done" && !!profile

    let buttonText = "Login"
    if (isSpotifyAuthorized && appleAuthorized) {
        buttonText = "Spotify + Apple Music"
    } else if (isSpotifyAuthorized) {
        buttonText = profile.display_name
    } else if (appleAuthorized) {
        buttonText = "Apple Music"
    }

    function reload() {
        window.location.href = "/"
    }

    return (
        <div className="w-full bg-purple-600 shadow-md z-50">
            <div className="w-full flex justify-between items-center py-3 px-7 max-w-screen-lg mx-auto">
                <div className="whitespace-nowrap flex-nowrap">
                    <p className="text-xl font-bold tracking-tight text-white m-0 p-0 cursor-pointer" onClick={reload}>
                        Music Composer
                    </p>
                    <p className="text-sm font-normal tracking-tight text-white opacity-75 -mt-1">
                        by{" "}
                        <a href="https://github.com/gomoritz" target="_blank" className="underline">
                            moritz
                        </a>
                    </p>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="bg-white px-4 py-1.5 rounded-md flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors max-w-[200px] sm:max-w-none"
                    >
                        <span className="truncate">{buttonText}</span>
                        <FaChevronDown className={`text-xs transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 z-[100]"
                            >
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => !isSpotifyAuthorized && authorizeSpotify()}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                                            isSpotifyAuthorized ? "bg-green-50 text-green-700" : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaSpotify className={isSpotifyAuthorized ? "text-green-500" : "text-gray-400"} />
                                            <span className="font-medium">Spotify</span>
                                        </div>
                                        {isSpotifyAuthorized && <FaCheckCircle className="text-green-500" />}
                                    </button>

                                    <button
                                        onClick={() =>
                                            !appleAuthorized && authorizeAppleMusic().then(() => window.location.reload())
                                        }
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                                            appleAuthorized ? "bg-red-50 text-red-700" : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaApple className={appleAuthorized ? "text-red-500" : "text-gray-400"} />
                                            <span className="font-medium">Apple Music</span>
                                        </div>
                                        {appleAuthorized && <FaCheckCircle className="text-red-500" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Header
