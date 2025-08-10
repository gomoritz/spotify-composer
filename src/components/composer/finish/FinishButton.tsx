import { AnimatePresence, motion, Variants } from "motion/react"
import React from "react"

type Props = {
    onClick: () => void,
    working: boolean,
}

const FinishButton: React.FC<Props> = ({ onClick, working }) => {
    const variants: Variants = {
        left: { x: -170, opacity: 0, },
        center: {
            x: 0,
            opacity: 1,
            transition: { delay: .5, bounce: 0, ease: "easeOut" }
        },
        right: { x: 170, opacity: 0, }
    }

    return (
        <motion.div
            className="sticky bottom-6 left-0 mx-auto w-48 h-12 text-center px-5 py-2 bg-emerald-500 text-white text-lg
                    shadow-lg rounded-lg cursor-pointer border-2 border-emerald-400 overflow-hidden
                    flex justify-center items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
        >
            <AnimatePresence initial={false}>
                {working ?
                    <motion.div key="loading" variants={variants} initial="right" animate="center" exit="right">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="150"
                            height="150"
                            style={{ transform: "scale(.3)" }}
                        >
                            <path
                                d="M38 74.707l24.647 24.646L116.5 45.5"
                                fill="transparent"
                                strokeWidth="10"
                                stroke="#fff"
                                strokeLinecap="round"
                            />
                        </svg>
                    </motion.div>
                    :
                    <motion.div key="not-loading" className="whitespace-nowrap"
                                variants={variants} initial="left" animate="center" exit="left"
                    >
                        Create Playlist
                    </motion.div>
                }
            </AnimatePresence>
        </motion.div>
    )
}

export default FinishButton