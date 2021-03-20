import { motion } from "framer-motion"
import React from "react"

interface Props {
    playlist: any
    isSelected: boolean
    togglePlaylist: (playlistId: string) => void
}

const PlaylistCard: React.FC<Props> = ({ playlist, isSelected, togglePlaylist }) => {
    const cardVariants = {
        selected: { scale: 1.04, opacity: 1 },
        default: { scale: 0.96, opacity: 0.8 }
    }

    return (
        <motion.div
            className={"bg-white shadow-sm rounded-lg flex flex-col " +
            "justify-between cursor-pointer transition-all " +
            (isSelected && "ring-2 ring-blue-400")}
            variants={cardVariants}
            animate={isSelected ? "selected" : "default"}
            onClick={() => togglePlaylist(playlist.id)}
        >
            <div style={{ backgroundImage: playlist.images[0] ? `url('${playlist.images[0].url}` : "linear-gradient(#4B5563, #1F2937)" }}
                 className="rounded-t-lg w-full h-32 bg-cover bg-center shadow-sm"
            />
            <p className="text-center text-sm mx-1 my-2 flex-grow">
                {playlist.name}
            </p>
        </motion.div>
    )
}

export default PlaylistCard