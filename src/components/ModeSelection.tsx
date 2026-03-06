"use client"

import React from "react"
import { motion } from "motion/react"
import { FaMusic, FaRandom } from "react-icons/fa"

interface Props {
    setMode: (mode: "compose" | "split") => void
}

const ModeSelection: React.FC<Props> = ({ setMode }) => {
    return (
        <motion.div
            className="w-full flex-grow flex flex-col items-center justify-center px-6"
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <h1 className="text-3xl font-bold tracking-tight text-center mb-2">What would you like to do?</h1>
            <p className="text-lg tracking-tight opacity-70 text-center mb-10 max-w-md">
                Choose a mode to get started with your playlists.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                <motion.div
                    className="flex-1 bg-white rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-transparent
                        hover:border-purple-500 transition-colors flex flex-col items-center text-center"
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode("compose")}
                >
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <FaMusic className="text-purple-600 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight mb-2">Compose</h2>
                    <p className="text-sm text-gray-500 tracking-tight leading-relaxed">
                        Select songs from your playlists and create a new playlist from your favorites.
                    </p>
                </motion.div>

                <motion.div
                    className="flex-1 bg-white rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-transparent
                        hover:border-purple-500 transition-colors flex flex-col items-center text-center"
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode("split")}
                >
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <FaRandom className="text-purple-600 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight mb-2">Split</h2>
                    <p className="text-sm text-gray-500 tracking-tight leading-relaxed">
                        Go through songs from your playlists and assign each one to different target playlists.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ModeSelection
