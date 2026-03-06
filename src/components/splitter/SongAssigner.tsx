"use client"

import React, { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import SongBackground from "@/components/composer/song/SongBackground"
import SongAudioPreview from "@/components/composer/song/audio/SongAudioPreview"
import SongAudioControls from "@/components/composer/song/audio/SongAudioControls"
import LoadingScreen from "@/components/composer/LoadingScreen"
import useAsync from "@/utils/useAsync"
import { GenericPlaylist, GenericSong } from "@/types/music"
import { collectSongs, SongLoadingState } from "@/utils/music"
import { SongAssignment } from "@/components/splitter/Splitter"
import { FaSpotify, FaApple, FaForward } from "react-icons/fa"

interface Props {
    sourcePlaylists: GenericPlaylist[]
    targetPlaylists: GenericPlaylist[]
    setAssignments: (assignments: SongAssignment) => void
}

const SongAssigner: React.FC<Props> = ({ sourcePlaylists, targetPlaylists, setAssignments }) => {
    const [loadingState, setLoadingState] = useState<SongLoadingState>()
    const loadSongs = useCallback(() => collectSongs(sourcePlaylists, setLoadingState), [sourcePlaylists])
    const { result: songs, state } = useAsync(loadSongs)

    const [index, setIndex] = useState(0)
    const [assignments, setLocalAssignments] = useState<SongAssignment>(() => {
        const initial: SongAssignment = {}
        targetPlaylists.forEach(p => {
            initial[p.id + ":" + p.provider.name] = []
        })
        return initial
    })

    const [targetVolume, setTargetVolume] = useState(readFromLocalStorage() ?? 0.15)
    const setVolume = (value: number) => {
        writeToLocalStorage(value)
        setTargetVolume(value)
    }

    useEffect(() => {
        if (state === "done" && songs && index === songs.length) {
            setAssignments(assignments)
        }
    }, [state, index, songs, setAssignments, assignments])

    function assignTo(playlist: GenericPlaylist) {
        if (!songs) return
        const key = playlist.id + ":" + playlist.provider.name
        setLocalAssignments(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), songs[index]]
        }))
        setIndex(prev => prev + 1)
    }

    function skip() {
        setIndex(prev => prev + 1)
    }

    const currentSong = songs && songs[index]
    const left = songs ? songs.length - index : 0

    return (
        <div className="w-full flex-grow overflow-hidden flex">
            <AnimatePresence>
                {currentSong && songs ? (
                    <motion.div
                        className="w-full flex-grow flex overflow-hidden relative"
                        animate={{ y: 0, opacity: 1 }}
                        initial={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut", bounce: 0.5 }}
                        key="assigner"
                    >
                        <SongAudioPreview
                            currentSong={currentSong}
                            key={currentSong.id + currentSong.provider.name}
                            targetVolume={targetVolume}
                        />
                        <SongAudioControls volume={targetVolume} setVolume={setVolume} />

                        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-center z-10"
                            style={{ background: "linear-gradient(to top, #000 25%, transparent 115%)" }}
                        >
                            <div className="w-full flex flex-col justify-start items-center mb-6 px-10 max-h-32 overflow-hidden">
                                <p className="text-white text-center tracking-tight mb-3">{left} songs left</p>
                                <h1 className="text-2xl text-white text-center font-bold tracking-tight">{currentSong.name}</h1>
                                <div className="flex items-center justify-center gap-2 opacity-70">
                                    {currentSong.provider.name === "spotify" ? (
                                        <FaSpotify className="text-[#1DB954] text-lg" title="Spotify" />
                                    ) : (
                                        <FaApple className="text-[#FA2D48] text-lg" title="Apple Music" />
                                    )}
                                    <p className="text-xl text-white text-center tracking-tight">{currentSong.artist}</p>
                                </div>
                            </div>

                            <div className="w-full max-w-lg px-6 pb-8 flex flex-col gap-2">
                                {targetPlaylists.map(playlist => (
                                    <motion.button
                                        key={playlist.id + playlist.provider.name}
                                        className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-15 backdrop-blur-sm
                                            text-white font-medium tracking-tight flex items-center gap-3
                                            border border-white border-opacity-20"
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(147, 51, 234, 0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => assignTo(playlist)}
                                    >
                                        {playlist.artworkUrl ? (
                                            <img
                                                src={playlist.artworkUrl}
                                                alt={playlist.name}
                                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-gradient-to-br from-gray-600 to-gray-800 flex-shrink-0" />
                                        )}
                                        <div className="flex-grow text-left truncate">
                                            <p className="truncate">{playlist.name}</p>
                                            <p className="text-xs opacity-60">
                                                {(assignments[playlist.id + ":" + playlist.provider.name] || []).length} songs assigned
                                            </p>
                                        </div>
                                        {playlist.provider.name === "spotify" ? (
                                            <FaSpotify className="text-[#1DB954] flex-shrink-0" />
                                        ) : (
                                            <FaApple className="text-[#FA2D48] flex-shrink-0" />
                                        )}
                                    </motion.button>
                                ))}
                                <motion.button
                                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-5
                                        text-white text-opacity-60 font-medium tracking-tight flex items-center justify-center gap-2
                                        border border-white border-opacity-10"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={skip}
                                >
                                    <FaForward className="text-sm" />
                                    <span>Skip</span>
                                </motion.button>
                            </div>
                        </div>

                        <SongBackground currentSong={currentSong} />
                    </motion.div>
                ) : (
                    <LoadingScreen
                        title={loadingState?.playlist?.name}
                        message={loadingState && `${loadingState.songs} unique songs`}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function writeToLocalStorage(volume: number) {
    localStorage.setItem("volume", String(volume))
}

function readFromLocalStorage(): number | null {
    const item = localStorage.getItem("volume")
    if (item) {
        const number = parseFloat(item)
        return isNaN(number) ? null : number
    } else return null
}

export default SongAssigner
