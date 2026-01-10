import React from "react"
import Image from "next/image"
import { GenericSong } from "@/types/music"
import { FaSpotify, FaApple } from "react-icons/fa"

interface Props {
    song: GenericSong
}

const SongItem: React.FC<Props> = ({ song }) => {
    const totalSeconds = (song.durationMs || 0) / 1000
    const durationSeconds = Math.round(totalSeconds % 60)
    const duration = Math.floor(totalSeconds / 60) + ":" + (durationSeconds < 10 ? "0" + durationSeconds : durationSeconds)

    const cover = song.artworkUrl

    return (
        <div key={song.id + song.provider.name} className="w-full bg-white rounded-lg shadow-sm my-2 flex h-12">
            {cover && (
                <Image
                    src={cover}
                    alt="album cover"
                    className="h-12 w-12 rounded-l-lg"
                    width={48}
                    height={48}
                    unoptimized={song.provider.name === "apple-music"}
                />
            )}
            <div className="h-full flex flex-col flex-grow justify-center ml-2 mr-4 overflow-hidden">
                <h1 className="text-md font-medium tracking-tight truncate">{song.name}</h1>
                <p className="text-sm leading-4 font-light tracking-tight truncate">{song.artist}</p>
            </div>
            <div className="h-full flex items-center pr-3 gap-3">
                {song.provider.name === "spotify" ? (
                    <FaSpotify className="text-[#1DB954] text-sm" title="Spotify" />
                ) : (
                    <FaApple className="text-[#FA2D48] text-sm" title="Apple Music" />
                )}
                <p className="text-right tracking-tight">{duration}</p>
            </div>
        </div>
    )
}

export default SongItem
