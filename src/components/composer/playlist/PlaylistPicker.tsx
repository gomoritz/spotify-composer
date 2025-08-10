import React, { useEffect, useState } from "react"
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react"
import FilterDropdown from "./FilterDropdown"
import PlaylistCard from "./PlaylistCard"
import useAsync from "@utils/useAsync"
import { getProfile } from "@spotify/profile"
import { buildPseudoPlaylistFromLibrary, getPlaylists } from "@spotify/playlists"
import { Playlist } from "@typedefs/spotify"
import LoadingScreen from "@components/composer/LoadingScreen"

interface Props {
    setIncludedPlaylists: (playlists: Playlist[]) => void
}

const FilterOptions = ["all", "owned", "liked"]
export type Filter = "all" | "owned" | "liked"

const PlaylistPicker: React.FC<Props> = ({ setIncludedPlaylists }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const { result: profile } = useAsync(getProfile)
    const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([])
    const [filter, setFilter] = useState<Filter>("all")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        ;(async () => {
            const [playlists, pseudoLibrary] = await Promise.all([getPlaylists(), buildPseudoPlaylistFromLibrary()])
            setPlaylists([pseudoLibrary, ...playlists])
            setLoading(false)
            console.log("Fetched playlists...")
        })().catch(console.error)
    }, [])

    const filteredPlaylists =
        filter === "owned"
            ? playlists.filter(p => p.owner.id === profile?.id)
            : filter === "liked"
            ? playlists.filter(p => p.owner.id !== profile?.id)
            : playlists

    const togglePlaylist = (playlist: Playlist) => {
        setSelectedPlaylists(prevState => {
            const newState = [...prevState]
            if (newState.includes(playlist)) {
                newState.splice(newState.indexOf(playlist), 1)
            } else {
                newState.push(playlist)
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
        <AnimatePresence>
            {playlists && playlists.length > 0 && filteredPlaylists && profile && !loading ? (
                <motion.div
                    key="playlist-picker"
                    animate={{ y: 0, opacity: 1 }}
                    initial={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut", bounce: 0.5 }}
                >
                    <div className="max-w-screen-lg w-full px-10 mx-auto">
                        <FilterDropdown current={filter} setFilter={setFilter} options={FilterOptions} />
                    </div>
                    <div className="max-w-screen-lg w-full mx-auto mb-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8 py-7">
                        {filteredPlaylists.map(playlist => (
                            <PlaylistCard
                                key={playlist.id}
                                isSelected={!!selectedPlaylists.find(it => it.id === playlist.id)}
                                playlist={playlist}
                                togglePlaylist={togglePlaylist}
                            />
                        ))}
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
                </motion.div>
            ) : (
                <LoadingScreen title="Connecting to Spotify" message="Downloading library" />
            )}
        </AnimatePresence>
    )
}

export default PlaylistPicker

