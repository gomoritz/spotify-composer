import React, { useEffect, useRef, useState } from "react"
import { IoVolumeHighOutline, IoVolumeLowOutline, IoVolumeMediumOutline, IoVolumeMuteOutline, IoVolumeOffOutline } from "react-icons/io5"
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion"
import { isMobile } from "react-device-detect"

type Props = {
    volume: number
    setVolume(value: number): void
}

const SongAudioControls: React.FC<Props> = ({ volume, setVolume }) => {
    const max = 0.45
    const percentage = (volume / max) * 100

    const [expanded, setExpanded] = useState(false)
    const beforeMute = useRef(0.15)

    const volumeControlRef = useRef<HTMLDivElement>(null)
    const y = useMotionValue(percentage)
    const dragControls = useDragControls()

    useEffect(() => {
        y.set(percentage, true)
    }, [y, percentage, volume])

    const Icon = percentage === 0 ? IoVolumeMuteOutline :
        percentage > 75 ? IoVolumeHighOutline :
            percentage > 50 ? IoVolumeMediumOutline :
                percentage > 25 ? IoVolumeLowOutline :
                    IoVolumeOffOutline

    const variants = {
        collapsed: { opacity: 0.0, scaleY: 0.0, y: -10 },
        expanded: { opacity: 1, scaleY: 1.0, y: 0 }
    }

    function updateVolume() {
        const yPercent = Math.max(0, Math.min(1, y.get() / 100))
        const coerced = Math.max(0, Math.min(max, yPercent * max))
        setVolume(coerced)
    }

    const snap: React.MouseEventHandler<HTMLDivElement> = (event) => {
        dragControls.start(event, { snapToCursor: true })
        updateVolume()
    }

    function toggleMuteOrExpand() {
        if (isMobile) {
            setExpanded(prev => !prev)
            return
        }

        if (volume === 0) {
            setVolume(beforeMute.current)
        } else {
            beforeMute.current = volume
            setVolume(0)
        }
    }

    return (
        <motion.div
            className="absolute top-0 right-0 z-30 mr-5 mt-5 p-2 pb-10 flex flex-col items-center"
            onHoverStart={() => setExpanded(true)}
            onHoverEnd={() => setExpanded(false)}
        >
            <Icon
                key="icon" className="w-10 h-10 cursor-pointer" color="white"
                style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, .4))" }}
                onClick={toggleMuteOrExpand}
            />
            <AnimatePresence>
                {
                    expanded &&
                    <motion.div
                        key="line" ref={volumeControlRef}
                        className="w-1 h-28 rounded-full bg-white bg-opacity-90 mt-4 cursor-pointer origin-top"
                        style={{ filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, .3))" }}
                        variants={variants} initial="collapsed" animate="expanded" exit="collapsed"
                        onClick={snap}
                    >
                        <motion.div
                            key="circle"
                            className="absolute -left-1 w-3 h-3.5 rounded-full bg-emerald-500 shadow-md"
                            style={{ y }}
                            drag="y" dragConstraints={volumeControlRef} dragControls={dragControls} dragElastic={0}
                            onDrag={updateVolume} onDragEnd={updateVolume} onDragTransitionEnd={updateVolume}
                        />
                    </motion.div>
                }
            </AnimatePresence>
        </motion.div>
    )
}

export default SongAudioControls
