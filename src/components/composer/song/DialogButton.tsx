import { motion } from "motion/react"
import React from "react"

type Props = {
    onClick(): void
    primary?: boolean
    dangerous?: boolean
    className?: string
    children: React.ReactNode
}

const DialogButton: React.FC<Props> = ({ onClick, primary, dangerous, className, children }) => {
    const classes = `w-44 py-1 text-center rounded-md shadow-sm font-medium tracking-tight cursor-pointer 
        ${primary ? "bg-emerald-300 text-emerald-800" :
            dangerous ? "bg-rose-200 text-rose-700" :
                "bg-neutral-200 text-neutral-700"} ${className}`

    return <motion.div className={classes}
                       whileHover={{ scale: 1.02, filter: "brightness(96%)" }}
                       whileTap={{ scale: 0.95 }}
                       animate={{ transition: { type: "spring" } }}
                       onClick={onClick}
    >
        {children}
    </motion.div>
}

export default DialogButton
