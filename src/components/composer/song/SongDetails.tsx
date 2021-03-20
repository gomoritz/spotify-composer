import React, { useRef } from "react"
import { motion, MotionValue, useTransform } from "framer-motion"

type Props = {
    currentSong: any
    x: MotionValue<number>
}

const SongDetails: React.FC<Props> = ({ currentSong, x }) => {
    const background = useTransform(x, [-150, 0, 150], ["#B91C1C99", "#000000", "#15803D99"])
    const dragGradientRef = useRef<HTMLDivElement | null>(null)

    background.onChange(value => {
        if (dragGradientRef.current) {
            dragGradientRef.current!.style.background = `linear-gradient(to top, ${value} 15%, transparent 115%)`
        }
    })

    const artists = currentSong.track.artists
    const artistsText = artists.slice(0, 4).map((it: any) => it.name).join(", ") +
        (artists.length > 4 ? ` and ${artists.length - 4} more` : "")

    return <motion.div
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-center z-10"
        style={{ background: `linear-gradient(to top, #000 15%, transparent 115%)` }}
        ref={dragGradientRef}
    >
        <div className="w-full flex flex-col justify-start items-center mb-20 px-10
                max-h-32 overflow-hidden">
            <h1 className="text-2xl text-white text-center font-bold tracking-tight">
                {currentSong.track.name}
            </h1>
            <p className="text-xl text-white text-center opacity-70 tracking-tight">
                {artistsText}
            </p>
        </div>
    </motion.div>
}

export default SongDetails