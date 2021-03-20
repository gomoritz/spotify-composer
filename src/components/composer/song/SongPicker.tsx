import React, { useCallback, useEffect, useState } from "react"
import { getAllSongs } from "../../../spotify/playlists"
import { useMotionValue } from "framer-motion"
import SongDragOverlay from "./SongDragOverlay"
import SongDetails from "./SongDetails"
import SongBackground from "./SongBackground"
import useAsync from "../../../utils/useAsync"

interface Props {
    includedPlaylists: string[]
    setIncludedSongs: (songs: any[]) => void
}

const SongPicker: React.FC<Props> = ({ includedPlaylists, setIncludedSongs }) => {
    const callback = useCallback(() => getAllSongs(includedPlaylists), [includedPlaylists])
    const { result: songs, state } = useAsync(callback)

    const [index, setIndex] = useState(0)
    const [taken, setTaken] = useState<any[]>([])

    const x = useMotionValue(0)

    useEffect(() => {
        if (state === "done" && index === songs!.length) {
            setIncludedSongs(taken)
        }
    }, [state, index, songs, setIncludedSongs, taken])

    function next() {
        setIndex(index + 1)
    }

    function take() {
        setTaken([...taken, currentSong])
        next()
    }

    function handleDragEnd() {
        if (x.get() > 30) take()
        else if (x.get() < -30) next()
    }

    if (state !== "done" || !songs) {
        return <div>Loading...</div>
    }

    const currentSong = songs[index]
    if (!currentSong) return <></>

    return (
        <div className="w-full flex-grow flex overflow-hidden relative">
            <SongDragOverlay x={x} onDragEnd={handleDragEnd}/>
            <SongDetails x={x} currentSong={currentSong}/>
            <SongBackground currentSong={currentSong}/>
        </div>
    )
}

export default SongPicker