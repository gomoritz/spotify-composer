import React, { useRef } from "react"
import { motion, MotionValue, useTransform } from "motion/react"
import { GenericSong } from "@/types/music"

type Props = {
    currentSong: GenericSong
    x: MotionValue<number>
    left: number
}

const SongDetails: React.FC<Props> = ({ currentSong, x, left }) => {
    const background = useTransform(x, [-150, 0, 150], ["rgb(95,15,15)", "#000000", "rgb(9,55,22)"])
    const dragGradientRef = useRef<HTMLDivElement | null>(null)

    background.onChange(value => {
        if (dragGradientRef.current) {
            dragGradientRef.current!.style.background = `linear-gradient(to top, ${value} 15%, transparent 115%)`
        }
    })

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-center z-10"
            style={{ background: `linear-gradient(to top, #000 15%, transparent 115%)` }}
            ref={dragGradientRef}
        >
            <div
                className="w-full flex flex-col justify-start items-center mb-20 px-10
                max-h-32 overflow-hidden"
            >
                <p className="text-white text-center tracking-tight mb-3">{left} songs left</p>
                <h1 className="text-2xl text-white text-center font-bold tracking-tight">{currentSong.name}</h1>
                <p className="text-xl text-white text-center opacity-70 tracking-tight">{currentSong.artist}</p>
            </div>
        </motion.div>
    )
}

export default SongDetails
