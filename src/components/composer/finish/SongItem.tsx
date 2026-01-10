import React from "react"
import Image from "next/image"
import { GenericSong } from "@/types/music"
import { FaSpotify, FaApple, FaExclamationCircle, FaCheckCircle } from "react-icons/fa"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

interface Props {
    song: GenericSong
    isFailed?: boolean
    isAnalyzing?: boolean
    isMatched?: boolean
}

const SongItem: React.FC<Props> = ({ song, isFailed, isAnalyzing, isMatched }) => {
    const totalSeconds = (song.durationMs || 0) / 1000
    const durationSeconds = Math.round(totalSeconds % 60)
    const duration = Math.floor(totalSeconds / 60) + ":" + (durationSeconds < 10 ? "0" + durationSeconds : durationSeconds)

    const cover = song.artworkUrl

    return (
        <div
            key={song.id + song.provider.name}
            className={`w-full rounded-lg shadow-sm my-2 flex h-12 transition-colors ${
                isFailed ? "bg-red-50 border border-red-200" : "bg-white"
            }`}
        >
            {cover && (
                <Image
                    src={cover}
                    alt="album cover"
                    className={`h-12 w-12 rounded-l-lg ${isFailed ? "opacity-50" : ""}`}
                    width={48}
                    height={48}
                    unoptimized={song.provider.name === "apple-music"}
                />
            )}
            <div className="h-full flex flex-col flex-grow justify-center ml-2 mr-4 overflow-hidden">
                <h1 className={`text-md font-medium tracking-tight truncate ${isFailed ? "text-red-900" : ""}`}>{song.name}</h1>
                <p className={`text-sm leading-4 font-light tracking-tight truncate ${isFailed ? "text-red-700" : ""}`}>
                    {song.artist}
                </p>
            </div>
            <div className="h-full flex items-center pr-3 gap-3">
                {isAnalyzing ? (
                    <AiOutlineLoading3Quarters className="text-purple-600 text-sm animate-spin" />
                ) : isMatched ? (
                    <FaCheckCircle className="text-green-500 text-sm" title="Available on destination service" />
                ) : isFailed ? (
                    <FaExclamationCircle className="text-red-500 text-sm" title="Not available on destination service" />
                ) : song.provider.name === "spotify" ? (
                    <FaSpotify className="text-[#1DB954] text-sm" title="Spotify" />
                ) : (
                    <FaApple className="text-[#FA2D48] text-sm" title="Apple Music" />
                )}
                <p className={`text-right tracking-tight ${isFailed ? "text-red-400" : ""}`}>{duration}</p>
            </div>
        </div>
    )
}

export default SongItem
