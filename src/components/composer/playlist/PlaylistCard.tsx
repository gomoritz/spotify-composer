import { motion, useMotionValue, useTransform } from "framer-motion"
import React from "react"

interface Props {
    playlist: any
    isSelected: boolean
    togglePlaylist: (playlistId: string) => void
}

const PlaylistCard: React.FC<Props> = ({ playlist, isSelected, togglePlaylist }) => {
    const cardVariants = {
        selected: { scale: 1.01, opacity: 1 },
        unselected: { scale: 0.96, opacity: 0.85 }
    }

    const overlayVariants = {
        selected: { opacity: 1.0 },
        unselected: { opacity: 0.0 }
    }

    const checkVariants = {
        selected: { pathLength: 0.9 },
        unselected: { pathLength: 0.0 }
    }

    const pathLength = useMotionValue(0)
    const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1])

    return (
        <motion.div
            className={"bg-white shadow-md rounded-xl flex flex-col group " +
            "justify-between cursor-pointer transition-all overflow-hidden " +
            (isSelected && "ring-4 ring-emerald-500")}
            variants={cardVariants}
            animate={isSelected ? "selected" : "unselected"}
            initial="unselected"
            whileTap={{ scale: 0.95 }}
            onClick={() => togglePlaylist(playlist.id)}
        >
            <motion.div
                className="absolute w-full h-full top-0 left-0 z-10 bg-black bg-opacity-10
                    flex justify-center items-center"
                variants={overlayVariants}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="150"
                    height="150"
                    style={{filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, .6))"}}
                >
                    <motion.path
                        d="M38 74.707l24.647 24.646L116.5 45.5"
                        fill="transparent"
                        strokeWidth="25"
                        stroke="#10B981"
                        strokeLinecap="round"
                        variants={checkVariants}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                        style={{ pathLength: pathLength, opacity: opacity }}
                    />
                </svg>
            </motion.div>

            <div className="rounded-t-xl w-full h-44 shadow-sm transition-all overflow-hidden">
                <div
                    style={{ backgroundImage: playlist.images[0] ? `url('${playlist.images[0].url}` : "linear-gradient(#4B5563, #1F2937)" }}
                    className={"w-full h-full bg-cover bg-center transition-all transform scale-110 group-hover:scale-100 " +
                    (isSelected && "scale-100")}
                />
            </div>
            <div className="w-full flex flex-row justify-between text-md tracking-tight px-3 py-2 flex-grow">
                <p className="font-semibold truncate whitespace-nowrap pr-2">
                    {playlist.name}
                </p>
                <p className="text-trueGray-600 flex-nowrap whitespace-nowrap">
                    {playlist.tracks.total} songs
                </p>
            </div>
        </motion.div>
    )
}

export default PlaylistCard