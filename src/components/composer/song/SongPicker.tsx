import React, { useCallback, useState } from "react"
import { getAllSongs } from "../../../spotify/playlists"
import { useMotionValue } from "framer-motion"
import SongDragOverlay from "./SongDragOverlay"
import SongDetails from "./SongDetails"
import SongBackground from "./SongBackground"
import useAsync from "../../../utils/useAsync"

interface Props {
    includedPlaylists: string[]
}

const SongPicker: React.FC<Props> = ({ includedPlaylists }) => {
    const callback = useCallback(() => getAllSongs(includedPlaylists), [includedPlaylists])
    const { result: songs, state } = useAsync(callback)

    const [index, setIndex] = useState(0)
    const [, setLiked] = useState<number[]>([])

    const x = useMotionValue(0)

    function next() {
        return setIndex(index + 1)
    }

    function like() {
        setLiked(prevState => {
            const newState = [...prevState]
            newState.push(index)
            return newState
        })
        next()
    }

    function handleDragEnd() {
        if (x.get() > 30) like()
        else if (x.get() < -30) next()
    }

    if (state !== "done" || !songs) {
        return <div>Loading...</div>
    }

    const currentSong = songs[index]

    return (
        <div className="w-full flex-grow flex overflow-hidden relative">
            <SongDragOverlay x={x} onDragEnd={handleDragEnd}/>
            <SongDetails x={x} currentSong={currentSong}/>
            <SongBackground currentSong={currentSong}/>
        </div>
    )
}

export default SongPicker