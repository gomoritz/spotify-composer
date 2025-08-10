import React from "react"
import { motion } from "motion/react"
import { useState } from "react"
import { useMeasurePosition } from "@utils/useMeasurePosition"

type Props = {
    i: number
    updatePosition: (i: number, offset: any) => void
    updateOrder: (i: number, dragOffset: any) => void
    children?: React.ReactNode
}

const DragItem: React.FC<Props> = ({ i, updatePosition, updateOrder, children }) => {
    const [isDragging, setDragging] = useState(false)
    const ref = useMeasurePosition((pos: any) => updatePosition(i, pos))
    return (
        <div
            style={{
                padding: 0,
                zIndex: isDragging ? 9999 : 1
            }}
        >
            <motion.div
                ref={ref}
                layout
                initial={false}
                style={{
                    background: "white",
                    marginBottom: 10,
                    borderRadius: 5
                }}
                whileHover={{
                    boxShadow: "0px 3px 3px rgba(0,0,0,0.15)"
                }}
                whileTap={{
                    boxShadow: "0px 5px 5px rgba(0,0,0,0.1)"
                }}
                drag="y"
                onDragStart={() => setDragging(true)}
                onDragEnd={() => setDragging(false)}
                onDrag={(_event, info) => {
                    const deltaY = (info as any)?.delta?.y ?? 0
                    if (isDragging) updateOrder(i, deltaY)
                }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export default DragItem

