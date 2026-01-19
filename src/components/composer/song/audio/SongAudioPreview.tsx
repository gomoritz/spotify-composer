"use client"

/* eslint-disable react-hooks/exhaustive-deps */
// ^ these checks are disabled because the changing of refs before an effect is cleared is intended
import React, { useEffect, useRef, useState } from "react"
import { GenericSong } from "@/types/music"
import interpolate, { Interpolation } from "@/utils/interpolate"
import { motion } from "motion/react"
import { getAppleMusicSongByISRC } from "@/apple/music"

type Props = {
    currentSong: GenericSong
    targetVolume: number
}

const SongAudioPreview: React.FC<Props> = ({ currentSong, targetVolume }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [progress, setProgress] = useState(0)
    const [effectivePreviewUrl, setEffectivePreviewUrl] = useState<string | undefined>(currentSong.previewUrl)

    useEffect(() => {
        let interrupted = false
        if (currentSong.previewUrl) {
            setEffectivePreviewUrl(currentSong.previewUrl)
        } else if (currentSong.isrc) {
            getAppleMusicSongByISRC(currentSong.isrc, currentSong.album).then(song => {
                if (!interrupted) {
                    setEffectivePreviewUrl(song?.previewUrl)
                }
            })
        } else {
            setEffectivePreviewUrl(undefined)
        }
        return () => {
            interrupted = true
        }
    }, [currentSong])

    const fadeInRef = useRef<Interpolation>(
        interpolate({
            from: 0,
            to: targetVolume,
            steps: 10,
            duration: 100,
            action: volume => {
                if (audioRef.current) {
                    audioRef.current.volume = coerceVolume(volume)
                }
            }
        })
    )

    const fadeOutRef = useRef<Interpolation>(
        interpolate({
            from: targetVolume,
            to: 0,
            steps: 10,
            duration: 100,
            action: volume => {
                if (audioRef.current) {
                    audioRef.current.volume = coerceVolume(volume)
                }
            }
        })
    )

    useEffect(() => {
        setProgress(0)
        if (!effectivePreviewUrl) {
            audioRef.current = null
            return
        }

        const audio: HTMLAudioElement = new Audio(effectivePreviewUrl)
        audioRef.current = audio

        let looping = false
        const listener = async () => {
            const d = audio.duration
            if (!isNaN(d) && d > 0) {
                setProgress((audio.currentTime / d) * 100)
            }

            if (!isNaN(d) && d > 0 && audio.currentTime > d - 1.3 && !looping) {
                looping = true
                await fadeOutRef.current.start()
                audio.pause()
                audio.currentTime = 0
                setProgress(0)
                await audio.play()
                await fadeInRef.current.start()
                looping = false
            }
        }
        audio.addEventListener("timeupdate", listener)

        let interrupted = false

        // start playback after 500ms
        setTimeout(async () => {
            if (interrupted) return
            try {
                audio.volume = 0.0
                await audio.play()
            } catch (e) {
                audioRef.current = null
                setProgress(-1)
                interrupted = true
                return
            }

            await fadeInRef.current.start()
        }, 500)

        // kill progress listener and stop playback
        return () => {
            audio.removeEventListener("timeupdate", listener)

            if (interrupted) return
            interrupted = true
            fadeInRef.current.interrupt()
            fadeOutRef.current.start().then(() => {
                audio.pause()
                audio.src = ""
                audio.load()
            })
        }
    }, [effectivePreviewUrl])

    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            audio.volume = coerceVolume(targetVolume)
            fadeInRef.current.to = targetVolume
            fadeOutRef.current.from = targetVolume
        }
    }, [targetVolume, effectivePreviewUrl])

    return (
        audioRef.current && (
            <>
                <div className="absolute bottom-0 left-0 w-full z-30 h-1.5 bg-purple-800" />
                <motion.div
                    className="absolute bottom-0 left-0 z-30 h-1.5 bg-purple-600"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: progress === 0 ? 0 : 1 }}
                />
            </>
        )
    )
}

function coerceVolume(volume: number) {
    return Math.max(0, Math.min(1, volume))
}

export default SongAudioPreview
