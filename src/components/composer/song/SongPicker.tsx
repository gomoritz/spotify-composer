import React, { useCallback, useEffect, useState } from "react"
import { useMotionValue } from "framer-motion"
import SongDragOverlay from "@components/SongDragOverlay"
import SongDetails from "@components/SongDetails"
import SongBackground from "@components/SongBackground"
import useAsync from "@utils/useAsync"
import { Song } from "@typedefs/spotify"
import { getAllSongs } from "@spotify/playlists"

interface Props {
    includedPlaylists: string[]
    setIncludedSongs: (songs: Song[]) => void
}

const SongPicker: React.FC<Props> = ({ includedPlaylists, setIncludedSongs }) => {
    const callback = useCallback(() => getAllSongs(includedPlaylists), [includedPlaylists])
    const { result: songs, state } = useAsync(callback)

    const [index, setIndex] = useState(0)
    const [taken, setTaken] = useState<Song[]>([])

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