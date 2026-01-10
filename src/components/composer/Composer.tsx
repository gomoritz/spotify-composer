"use client"

import React, { useState } from "react"
import PlaylistPicker from "@/components/composer/playlist/PlaylistPicker"
import SongPicker from "@/components/composer/song/SongPicker"
import FinishScreen from "@/components/composer/finish/FinishScreen"
import { GenericPlaylist, GenericSong } from "@/types/music"

const Composer: React.FC = () => {
    const [includedPlaylists, setIncludedPlaylists] = useState<GenericPlaylist[] | null>(null)
    const [includedSongs, setIncludedSongs] = useState<GenericSong[] | null>(null)

    if (includedSongs) return <FinishScreen songs={includedSongs} />

    if (includedPlaylists) return <SongPicker includedPlaylists={includedPlaylists} setIncludedSongs={setIncludedSongs} />

    return <PlaylistPicker setIncludedPlaylists={setIncludedPlaylists} />
}

export default Composer
