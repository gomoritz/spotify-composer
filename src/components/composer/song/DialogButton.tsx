import { motion } from "framer-motion"
import React from "react"

type Props = {
    onClick(): void
    primary?: boolean
    className?: string
}

const DialogButton: React.FC<Props> = ({ onClick, primary, className, children }) => {
    return <motion.div className={
        `w-44 py-1 text-center rounded-md shadow-sm font-medium tracking-tight cursor-pointer 
        ${primary ? "bg-emerald-300 text-emerald-800" : "bg-trueGray-200 text-trueGray-700"} 
        ${className}`
    }
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={onClick}
    >
        {children}
    </motion.div>
}

export default DialogButton
