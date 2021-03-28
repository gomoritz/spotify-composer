import React, { useState } from "react"
import { motion, Variants } from "framer-motion"

type Props = {
    restore: () => void
    discard: () => void
}

const SongProgressRestoreDialog: React.FC<Props> = ({ restore, discard }) => {
    const [visible, setVisible] = useState(true)

    function callback(func: () => void) {
        setVisible(false)
        func()
    }

    const backgroundVariants: Variants = {
        visible: {
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "block"
        },
        hidden: {
            backgroundColor: "rgba(0,0,0,0.0)",
            transitionEnd: {
                display: "none"
            }
        }
    }

    const dialogVariants: Variants = {
        visible: {
            scale: 1,
            opacity: 1
        },
        hidden: {
            scale: 0,
            opacity: 0
        }
    }

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full z-50"
            variants={backgroundVariants}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
        >
            <div className="mx-auto max-w-screen-lg h-full flex justify-center items-center">
                <motion.div
                    className="bg-trueGray-100 shadow-lg rounded-lg flex flex-col w-1/2 text-center px-10 py-7"
                    variants={dialogVariants}
                >
                    <h1 className="text-xl font-semibold tracking-tight mb-4">
                        Your previous composition was saved!
                    </h1>
                    <p className="tracking-tight opacity-90">
                        The progress from a previous composing session for this song combination has been found.
                        Do you want to restore the progress or discard it and start all over again?
                    </p>
                    <div className="w-full flex flex-row justify-between mt-10">
                        <motion.div className="w-44 py-1 text-center bg-trueGray-200 text-trueGray-700 rounded-md
                                    shadow-sm font-medium tracking-tight cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => callback(discard)}
                        >
                            Discard
                        </motion.div>
                        <motion.div className="w-44 py-1 text-center bg-emerald-300 text-emerald-800 rounded-md
                                    shadow-sm font-medium tracking-tight cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => callback(restore)}
                        >
                            Restore
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default SongProgressRestoreDialog