import React, { useState } from "react"
import PlaylistPicker from "@components/PlaylistPicker"
import SongPicker from "@components/SongPicker"
import FinishScreen from "@components/FinishScreen"
import { Song } from "@typedefs/spotify"

const Composer: React.FC = () => {
    const [includedPlaylists, setIncludedPlaylists] = useState<string[] | null>(null)
    const [includedSongs, setIncludedSongs] = useState<Song[] | null>(null)

    if (includedSongs) return (
        <FinishScreen songs={includedSongs}/>
    )

    if (includedPlaylists) return (
        <SongPicker includedPlaylists={includedPlaylists} setIncludedSongs={setIncludedSongs}/>
    )

    return <PlaylistPicker setIncludedPlaylists={setIncludedPlaylists}/>
}

export default Composer