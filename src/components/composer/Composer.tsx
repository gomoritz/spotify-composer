import React, { useState } from "react"
import PlaylistPicker from "./playlist/PlaylistPicker"
import SongPicker from "./song/SongPicker"

const Composer: React.FC = () => {
    const [includedPlaylists, setIncludedPlaylists] = useState<string[] | null>(null)
    return includedPlaylists
        ? <SongPicker includedPlaylists={includedPlaylists}/>
        : <PlaylistPicker setIncludedPlaylists={setIncludedPlaylists}/>
}

export default Composer