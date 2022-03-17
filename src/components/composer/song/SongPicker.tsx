import React, { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, useMotionValue } from "framer-motion"
import SongDragOverlay from "@components/composer/song/SongDragOverlay"
import SongDetails from "@components/composer/song/SongDetails"
import SongBackground from "@components/composer/song/SongBackground"
import useAsync from "@utils/useAsync"
import { Playlist, Song } from "@typedefs/spotify"
import { collectSongs, SongLoadingState } from "@spotify/playlists"
import SongAudioPreview from "@components/composer/song/audio/SongAudioPreview"
import SongAudioControls from "@components/composer/song/audio/SongAudioControls"
import LoadingScreen from "@components/composer/LoadingScreen"
import { deleteProgress, readProgress, saveProgress, SongPickingProgress } from "@utils/progress"
import SongProgressRestoreDialog from "@components/composer/song/SongProgressRestoreDialog"
import SongOptionsButton from "@components/composer/song/manipulation/SongOptionsButton"
import SongOptionsDialog from "@components/composer/song/manipulation/SongOptionsDialog"

interface Props {
    includedPlaylists: Playlist[]
    setIncludedSongs: (songs: Song[]) => void
}

const SongPicker: React.FC<Props> = ({ includedPlaylists, setIncludedSongs }) => {
    const [loadingState, setLoadingState] = useState<SongLoadingState>()
    const [progress, setProgress] = useState<SongPickingProgress | null>(null)
    const loadSongs = useCallback(() => collectSongs(includedPlaylists, setLoadingState), [includedPlaylists])
    const { result: songs, setResult: setSongs, state } = useAsync(loadSongs)

    useEffect(() => {
        if (songs) {
            const obj = readProgress(songs)
            setProgress(obj)
        }
    }, [songs])

    const [index, setIndex] = useState(0)
    const [taken, setTaken] = useState<number[]>([])

    const x = useMotionValue(0)

    const [targetVolume, setTargetVolume] = useState(readFromLocalStorage() ?? 0.15)
    const setVolume = (value: number) => {
        writeToLocalStorage(value)
        setTargetVolume(value)
    }

    const [optionsOverlay, setOptionsOverlay] = useState(false)

    useEffect(() => {
        if (state === "done" && index === songs!.length) {
            setIncludedSongs(taken.map(index => songs![index]))
        }
    }, [state, index, songs, setIncludedSongs, taken])

    useEffect(() => {
        if (songs && index > 0) {
            saveProgress(songs, { index, taken })
        }
    }, [songs, index, taken])

    function next() {
        setIndex(prev => prev + 1)
    }

    function take() {
        setTaken(prev => [...prev, index])
        next()
    }

    function handleDragEnd() {
        if (x.get() > 30) take()
        else if (x.get() < -30) next()
    }

    function discardProgress() {
        if (songs && progress) {
            console.log("discarding progress")
            deleteProgress(songs)
        }
    }

    function restoreProgress() {
        if (progress) {
            console.log("restoring progress")
            setIndex(progress.index)
            setTaken(progress.taken)
        }
    }

    function takeRemaining() {
        setTaken(prev => {
            const remaining = Array(songs!.length - index).map((_, i) => i + index)
            return [...prev, ...remaining]
        })
        setIndex(songs!.length)
    }

    function dropRemaining() {
        setIndex(songs!.length)
    }

    const currentSong = songs && songs[index]

    return (
        <div className="w-full flex-grow overflow-hidden flex">
            <AnimatePresence>
                {currentSong && songs ? (
                    <motion.div
                        className="w-full flex-grow flex overflow-hidden relative"
                        animate={{ y: 0, opacity: 1 }}
                        initial={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut", bounce: 0.5 }}
                        key="picker"
                    >
                        {progress && <SongProgressRestoreDialog restore={restoreProgress} discard={discardProgress} />}

                        <SongOptionsButton setOptionsOverlay={setOptionsOverlay} />
                        <SongOptionsDialog
                            isVisible={optionsOverlay}
                            setVisible={setOptionsOverlay}
                            takeRemaining={takeRemaining}
                            dropRemaining={dropRemaining}
                            setSongs={setSongs}
                            setTaken={setTaken}
                            index={index}
                            setIndex={setIndex}
                        />

                        <SongAudioPreview currentSong={currentSong} key={currentSong.track.id} targetVolume={targetVolume} />
                        <SongAudioControls volume={targetVolume} setVolume={setVolume} />

                        <SongDragOverlay x={x} onDragEnd={handleDragEnd} />
                        <SongDetails x={x} currentSong={currentSong} left={songs.length - index} />

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
        const number = parseInt(item)
        return isNaN(number) ? null : number
    } else return null
}

export default SongPicker
