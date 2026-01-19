import React from "react"
import { motion } from "motion/react"

type Props = {
    title?: string
    message?: string
}

const LoadingScreen: React.FC<Props> = ({ title, message }) => {
    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center"
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: .6, ease: "easeInOut", bounce: .5 }}
            key="loading-screen"
        >
            <div className="my-20">
                {[0, 1, 2].map(i => (
                    <motion.span
                        key={i} className="w-5 h-5 mx-1 rounded-full bg-purple-600 inline-block shadow-md"
                        initial={{ y: -15 }}
                        animate={{ y: [-15, 15, -15] }}
                        transition={{
                            duration: 1,
                            delay: i * .2,
                            ease: "easeInOut",
                            repeat: Infinity
                        }}
                    />
                ))}
            </div>
            <div>
                <h1 className="text-center text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-center text-lg tracking-tight opacity-80">{message}</p>
            </div>
        </motion.div>
    )
}

export default LoadingScreen