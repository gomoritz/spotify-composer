import React from "react"
import Image from "next/image"
import { Song } from "@/types/spotify"

interface Props {
    song: Song
}

const SongItem: React.FC<Props> = ({ song }) => {
    const totalSeconds = song.track.duration_ms / 1000
    const durationSeconds = Math.round(totalSeconds % 60)
    const duration = Math.floor(totalSeconds / 60) + ":" + (durationSeconds < 10 ? "0" + durationSeconds : durationSeconds)

    const cover = song.track.album.images[0]?.url

    return (
        <div key={song.track.id} className="w-full bg-white rounded-lg shadow-sm my-2 flex h-12">
            {cover && (
                <Image src={cover} alt="album cover" className="h-12 w-12 rounded-l-lg" width={48} height={48} />
            )}
            <div className="h-full flex flex-col flex-grow justify-center ml-2 mr-4 overflow-hidden">
                <h1 className="text-md font-medium tracking-tight truncate">{song.track.name}</h1>
                <p className="text-sm leading-4 font-light tracking-tight truncate">
                    {song.track.artists.slice(0, 4).map(artist => artist.name).join(", ")}
                </p>
            </div>
            <p className="h-full flex flex-col justify-center text-right pr-3 tracking-tight">
                {duration}
            </p>
        </div>
    )
}

export default SongItem