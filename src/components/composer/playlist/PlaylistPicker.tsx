import React, { useEffect, useState } from "react"
import { getPlaylists } from "../../../spotify/playlists"
import PlaylistCard from "./PlaylistCard"

interface Props {
    setIncludedPlaylists: (playlists: string[]) => void
}

const PlaylistPicker: React.FC<Props> = ({ setIncludedPlaylists }) => {
    const [playlists, setPlaylists] = useState<string[]>([])
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])

    useEffect(() => {
        getPlaylists()
            .then(fetched => {
                setPlaylists(fetched)
                console.log("Fetched playlists...")
            })
            .catch(console.error)
    }, [])

    const togglePlaylist = (id: string) => {
        setSelectedPlaylists(prevState => {
            const newState = [...prevState]
            if (newState.includes(id)) {
                newState.splice(newState.indexOf(id), 1)
            } else {
                newState.push(id)
            }
            return newState
        })
    }

    const finishSelection = () => {
        if (selectedPlaylists.length > 0) {
            setIncludedPlaylists(selectedPlaylists)
        }
    }

    return (
        <>
            <div className="max-w-screen-xl w-full mx-auto grid
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8 py-2">
                {playlists.map((playlist: any) =>
                    <PlaylistCard key={playlist.id}
                                  isSelected={selectedPlaylists.includes(playlist.id)}
                                  playlist={playlist} togglePlaylist={togglePlaylist}/>
                )}
            </div>
            <div className="mx-auto mb-10 mt-4 px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer"
                 onClick={finishSelection}>
                Finish playlist selection
            </div>
        </>
    )
}

export default PlaylistPicker
