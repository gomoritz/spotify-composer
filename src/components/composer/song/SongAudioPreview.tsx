import React, { useEffect, useRef, useState } from "react"
import { Song } from "@typedefs/spotify"
import interpolate from "@utils/interpolate"
import { motion } from "framer-motion"

type Props = {
    currentSong: Song
}

const SongAudioPreview: React.FC<Props> = ({ currentSong }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [progress, setProgress] = useState(0)
    const [targetVolume, setTargetVolume] = useState(.08)

    useEffect(() => {
        setProgress(0)
        const previewUrl = currentSong.track.preview_url
        if (!previewUrl) return

        const audio: HTMLAudioElement = new Audio(previewUrl)
        audioRef.current = audio
        audio.volume = 0.0

        let looping = false
        const listener = async () => {
            setProgress((audio.currentTime / audio.duration) * 100)
            if (audio.currentTime > audio.duration - 2 && !looping) {
                looping = true
                await fadeOut.start()
                audio.pause()
                audio.currentTime = 0
                setProgress(0)
                await audio.play()
                await fadeIn.start()
                looping = false
            }
        }
        audio.addEventListener("timeupdate", listener)

        // interpolation to fade volume in
        const fadeIn = interpolate({
            from: 0,
            to: targetVolume,
            steps: 10,
            duration: 100,
            action: (volume) => audio.volume = volume
        })

        // interpolation to fade volume out
        const fadeOut = interpolate({
            from: targetVolume,
            to: 0,
            steps: 10,
            duration: 100,
            action: (volume) => audio.volume = volume
        })

        // start playback after 500ms
        setTimeout(() => {
            audio.play()
            fadeIn.start()
        }, 500)

        // kill progress listener and stop playback
        return () => {
            audio.removeEventListener("timeupdate", listener)
            fadeIn.interrupt()
            fadeOut.start().then(() => audio.pause())
        }
    }, [currentSong, targetVolume])

    return (
        <>
            <div onClick={() => setTargetVolume(targetVolume === .08 ? .03 : .08)}
                 className="absolute bottom-0 left-0 w-full z-30 h-1.5 bg-emerald-700"/>
            <motion.div
                className="absolute bottom-0 left-0 z-30 h-1.5 bg-emerald-500"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: progress === 0 ? 0 : 1 }}
            />
        </>
    )
}

export default SongAudioPreview