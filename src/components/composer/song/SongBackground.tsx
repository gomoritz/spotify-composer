import React from "react"
import { Song } from "@/types/spotify"

type Props = { currentSong: Song }

const SongBackground: React.FC<Props> = ({ currentSong }) => {
    return (
        <div className="flex-grow transform scale-105 bg-cover bg-center"
             style={{
                 backgroundColor: "#000000",
                 backgroundImage: `url('${currentSong.track.album.images[0]?.url}')`,
                 filter: "blur(10px)"
             }}
        />
    )
}

export default SongBackground