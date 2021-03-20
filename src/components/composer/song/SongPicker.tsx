import React, { useEffect, useState } from "react"
import { getAllSongs } from "../../../spotify/playlists"

interface Props {
    includedPlaylists: string[]
}

const SongPicker: React.FC<Props> = ({ includedPlaylists }) => {
    const [songs, setSongs] = useState<any[]>([])

    useEffect(() => {
        console.log("includedPlaylists =", includedPlaylists)
        getAllSongs(includedPlaylists).then(songs => setSongs(songs))
    }, [includedPlaylists])


    return (
        <div>
            {songs.map(song => {
                return <div key={song.track.id}>{song.track.name}</div>
            })}
        </div>
    )
}

export default SongPicker