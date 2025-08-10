import { motion } from "motion/react"
import React from "react"
import { IoOptions } from "react-icons/io5"

type Props = {
    setOptionsOverlay(value: boolean): void
}

const SongOptionsButton: React.FC<Props> = ({setOptionsOverlay}) => {
    return (
        <motion.div
            className="absolute top-0 left-0 z-30 ml-5 mt-5"
        >
            <IoOptions
                key="icon" className="w-10 h-10 cursor-pointer" color="white"
                style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, .5))" }}
                onClick={() => setOptionsOverlay(true)}
            />
        </motion.div>
    )
}

export default SongOptionsButton
