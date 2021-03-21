import React, { useEffect, useState } from "react"
import { getPlaylists } from "../../../spotify/playlists"
import PlaylistCard from "./PlaylistCard"
import { motion } from "framer-motion"

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
            <div className="max-w-screen-lg w-full mx-auto mb-7 grid
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8 py-7">
                {playlists.map((playlist: any) =>
                    <PlaylistCard key={playlist.id}
                                  isSelected={selectedPlaylists.includes(playlist.id)}
                                  playlist={playlist} togglePlaylist={togglePlaylist}/>
                )}
            </div>
            <motion.div
                className="sticky bottom-6 left-0 mx-auto w-64 h-12 text-center px-5 py-2 bg-emerald-500 text-white text-lg
                    shadow-lg rounded-lg cursor-pointer border-2 border-emerald-400 overflow-hidden
                    flex justify-center items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={finishSelection}
            >
                Finish playlist selection
            </motion.div>
        </>
    )
}

export default PlaylistPicker
