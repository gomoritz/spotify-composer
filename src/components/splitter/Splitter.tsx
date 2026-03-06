"use client"

import React, { useState } from "react"
import PlaylistPicker from "@/components/composer/playlist/PlaylistPicker"
import SongAssigner from "@/components/splitter/SongAssigner"
import SplitFinishScreen from "@/components/splitter/SplitFinishScreen"
import { GenericPlaylist, GenericSong } from "@/types/music"
import TargetPlaylistPicker from "@/components/splitter/TargetPlaylistPicker"

export interface SongAssignment {
    [playlistId: string]: GenericSong[]
}

const Splitter: React.FC = () => {
    const [sourcePlaylists, setSourcePlaylists] = useState<GenericPlaylist[] | null>(null)
    const [targetPlaylists, setTargetPlaylists] = useState<GenericPlaylist[] | null>(null)
    const [assignments, setAssignments] = useState<SongAssignment | null>(null)

    if (assignments && targetPlaylists)
        return <SplitFinishScreen assignments={assignments} targetPlaylists={targetPlaylists} />

    if (targetPlaylists && sourcePlaylists)
        return (
            <SongAssigner
                sourcePlaylists={sourcePlaylists}
                targetPlaylists={targetPlaylists}
                setAssignments={setAssignments}
            />
        )

    if (sourcePlaylists)
        return <TargetPlaylistPicker sourcePlaylists={sourcePlaylists} setTargetPlaylists={setTargetPlaylists} />

    return <PlaylistPicker setIncludedPlaylists={setSourcePlaylists} />
}

export default Splitter
