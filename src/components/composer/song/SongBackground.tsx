import React from "react"
import { GenericSong } from "@/types/music"

type Props = { currentSong: GenericSong }

const SongBackground: React.FC<Props> = ({ currentSong }) => {
    return (
        <div
            className="flex-grow transform scale-105 bg-cover bg-center"
            style={{
                backgroundColor: "#000000",
                backgroundImage: `url('${currentSong.artworkUrl}')`,
                filter: "blur(10px)"
            }}
        />
    )
}

export default SongBackground
