import { motion, MotionValue, useTransform } from "framer-motion"
import React from "react"

type Props = {
    x: MotionValue<number>,
    onDragEnd: () => void,
}

const SongDragOverlay: React.FC<Props> = ({ onDragEnd, x }) => {
    const dropOpacity = useTransform(x, [-150, 0, 150], [1, 1, 0])
    const takeOpacity = useTransform(x, [-150, 0, 150], [0, 1, 1])

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full z-20 pb-64 text-2xl text-white cursor-pointer
                    flex flex-col justify-end items-center"
            style={{ x: x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
        >
            <div>
                <motion.span style={{ opacity: dropOpacity }}>&larr; Drop</motion.span>
                <span className="mx-4">|</span>
                <motion.span style={{ opacity: takeOpacity }}>Take &rarr;</motion.span>
            </div>
        </motion.div>
    )
}

export default SongDragOverlay