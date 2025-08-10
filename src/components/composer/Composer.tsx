"use client"

import React, { useState } from "react"
import PlaylistPicker from "@/components/composer/playlist/PlaylistPicker"
import SongPicker from "@/components/composer/song/SongPicker"
import FinishScreen from "@/components/composer/finish/FinishScreen"
import { Playlist, Song } from "@/types/spotify"

const Composer: React.FC = () => {
    const [includedPlaylists, setIncludedPlaylists] = useState<Playlist[] | null>(null)
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