import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import FilterDropdown from "./FilterDropdown"
import PlaylistCard from "./PlaylistCard"
import useAsync from "@utils/useAsync"
import { getProfile } from "@spotify/profile"
import { getPlaylists } from "@spotify/playlists"
import { Playlist } from "@typedefs/spotify"

interface Props {
    setIncludedPlaylists: (playlists: string[]) => void
}

const FilterOptions = ["all", "owned", "liked"]
export type Filter = "all" | "owned" | "liked"

const PlaylistPicker: React.FC<Props> = ({ setIncludedPlaylists }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const { result: profile } = useAsync(getProfile)
    const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([])
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])
    const [filter, setFilter] = useState<Filter>("all")

    useEffect(() => {
        getPlaylists()
            .then(fetched => {
                setPlaylists(fetched)
                console.log("Fetched playlists...")
            })
            .catch(console.error)
    }, [])

    useEffect(() => {
        setFilteredPlaylists(() => {
            if (filter === "owned") return playlists.filter(p => p.owner.id === profile?.id)
            else if (filter === "liked") return playlists.filter(p => p.owner.id !== profile?.id)
            return playlists
        })
    }, [filter, playlists, profile?.id])

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
            {playlists && playlists.length > 0 ? (
                <div className="max-w-screen-lg w-full px-10 mx-auto">
                    <FilterDropdown current={filter} setFilter={setFilter} options={FilterOptions} />
                </div>
            ) : (
                <p className="mt-10 text-center">Loading...</p>
            )}
            <div
                className="max-w-screen-lg w-full mx-auto mb-7 grid
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8 py-7"
            >
                {filteredPlaylists &&
                    filteredPlaylists.map(playlist => (
                        <PlaylistCard
                            key={playlist.id}
                            isSelected={selectedPlaylists.includes(playlist.id)}
                            playlist={playlist}
                            togglePlaylist={togglePlaylist}
                        />
                    ))}
            </div>
            {playlists && playlists.length > 0 && (
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
            )}
        </>
    )
}

export default PlaylistPicker
