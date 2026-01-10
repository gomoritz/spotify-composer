"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import FilterDropdown from "./FilterDropdown"
import PlaylistCard from "./PlaylistCard"
import useAsync from "@/utils/useAsync"
import { getProfile } from "@/spotify/profile"
import { buildPseudoPlaylistFromLibrary, getPlaylists } from "@/spotify/playlists"
import { GenericPlaylist, mapSpotifyPlaylist } from "@/types/music"
import { getAppleMusicPlaylists, isAppleMusicAuthorized } from "@/apple/music"
import { getAccessToken } from "@/spotify/authorization"
import LoadingScreen from "@/components/composer/LoadingScreen"

interface Props {
    setIncludedPlaylists: (playlists: GenericPlaylist[]) => void
}

const FilterOptions = ["all", "owned", "liked"]
export type Filter = "all" | "owned" | "liked"

const PlaylistPicker: React.FC<Props> = ({ setIncludedPlaylists }) => {
    const [playlists, setPlaylists] = useState<GenericPlaylist[]>([])
    const [selectedPlaylists, setSelectedPlaylists] = useState<GenericPlaylist[]>([])
    const [filter, setFilter] = useState<Filter>("all")
    const [loading, setLoading] = useState<boolean>(true)

    const updateTrackCount = (id: string, providerName: string, count: number) => {
        setPlaylists(prev => prev.map(p => (p.id === id && p.provider.name === providerName ? { ...p, trackCount: count } : p)))
        setSelectedPlaylists(prev =>
            prev.map(p => (p.id === id && p.provider.name === providerName ? { ...p, trackCount: count } : p))
        )
    }

    const filteredPlaylists = playlists.filter(p => {
        if (filter === "owned")
            return p.provider.name === "apple-music" || p.id === "library-pseudo" || (p.provider.name === "spotify" && true) // Simplified for now as profile check is Spotify specific
        return true
    })

    useEffect(() => {
        const fetchAllPlaylists = async () => {
            const allPlaylists: GenericPlaylist[] = []

            try {
                if (getAccessToken()) {
                    try {
                        allPlaylists.push(mapSpotifyPlaylist(await buildPseudoPlaylistFromLibrary()))
                        const spotifyPlaylists = await getPlaylists()
                        allPlaylists.push(...spotifyPlaylists.map(mapSpotifyPlaylist))
                    } catch (e) {
                        console.error("Error fetching Spotify playlists", e)
                    }
                }

                if (isAppleMusicAuthorized()) {
                    try {
                        const applePlaylists = await getAppleMusicPlaylists()
                        allPlaylists.push(...applePlaylists)
                    } catch (e) {
                        console.error("Error fetching Apple Music playlists", e)
                    }
                }

                setPlaylists(allPlaylists)
            } finally {
                setLoading(false)
            }
        }

        fetchAllPlaylists()
    }, [])

    const togglePlaylist = (playlist: GenericPlaylist) => {
        setSelectedPlaylists(prevState => {
            const newState = [...prevState]
            if (newState.find(p => p.id === playlist.id && p.provider.name === playlist.provider.name)) {
                return newState.filter(p => !(p.id === playlist.id && p.provider.name === playlist.provider.name))
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
            {!loading ? (
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
                                key={playlist.id + playlist.provider.name}
                                isSelected={
                                    !!selectedPlaylists.find(
                                        it => it.id === playlist.id && it.provider.name === playlist.provider.name
                                    )
                                }
                                playlist={playlist}
                                togglePlaylist={togglePlaylist}
                                onTrackCountLoaded={updateTrackCount}
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
                <LoadingScreen title="Connecting to Music Services" message="Downloading library" />
            )}
        </AnimatePresence>
    )
}

export default PlaylistPicker
