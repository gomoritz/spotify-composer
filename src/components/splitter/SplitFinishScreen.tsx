"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { GenericPlaylist, GenericSong } from "@/types/music"
import { SongAssignment } from "@/components/splitter/Splitter"
import { addSongsToPlaylist, searchSpotifyByISRC, searchSpotifyByMetadata } from "@/spotify/playlists"
import { addSongsToAppleMusicPlaylist, getAppleMusicSongByISRC, searchAppleMusicByMetadata } from "@/apple/music"
import { FaSpotify, FaApple, FaCheck, FaExclamationTriangle } from "react-icons/fa"
import FinishButton from "@/components/composer/finish/FinishButton"

interface Props {
    assignments: SongAssignment
    targetPlaylists: GenericPlaylist[]
}

interface PlaylistStatus {
    state: "pending" | "processing" | "done" | "error"
    matched: number
    failed: number
    total: number
}

const SplitFinishScreen: React.FC<Props> = ({ assignments, targetPlaylists }) => {
    const [working, setWorking] = useState(false)
    const [statuses, setStatuses] = useState<{ [key: string]: PlaylistStatus }>({})
    const [done, setDone] = useState(false)

    const totalAssigned = targetPlaylists.reduce((sum, p) => {
        const key = p.id + ":" + p.provider.name
        return sum + (assignments[key]?.length || 0)
    }, 0)

    async function matchSongToProvider(song: GenericSong, provider: "spotify" | "apple-music"): Promise<GenericSong | null> {
        if (song.provider.name === provider) return song

        if (provider === "spotify") {
            let uri = song.isrc ? await searchSpotifyByISRC(song.isrc, song.album) : null
            if (!uri) uri = await searchSpotifyByMetadata(song.name, song.artist, song.album)
            if (uri) return { ...song, uri, provider: { name: "spotify", id: "spotify" } }
        } else {
            let amSong = song.isrc ? await getAppleMusicSongByISRC(song.isrc, song.album) : null
            if (!amSong) amSong = await searchAppleMusicByMetadata(song.name, song.artist, song.album)
            if (amSong) return amSong
        }

        return null
    }

    async function execute() {
        if (working || done) return
        setWorking(true)

        try {
            for (const playlist of targetPlaylists) {
                const key = playlist.id + ":" + playlist.provider.name
                const songs = assignments[key] || []

                if (songs.length === 0) continue

                setStatuses(prev => ({
                    ...prev,
                    [key]: { state: "processing", matched: 0, failed: 0, total: songs.length }
                }))

                const matchedSongs: GenericSong[] = []
                let failedCount = 0

                for (const song of songs) {
                    const matched = await matchSongToProvider(song, playlist.provider.name)
                    if (matched) {
                        matchedSongs.push(matched)
                    } else {
                        failedCount++
                    }
                    setStatuses(prev => ({
                        ...prev,
                        [key]: { state: "processing", matched: matchedSongs.length, failed: failedCount, total: songs.length }
                    }))
                }

                try {
                    if (playlist.provider.name === "spotify") {
                        await addSongsToPlaylist(playlist.id, matchedSongs)
                    } else {
                        await addSongsToAppleMusicPlaylist(playlist.id, matchedSongs)
                    }

                    setStatuses(prev => ({
                        ...prev,
                        [key]: { state: "done", matched: matchedSongs.length, failed: failedCount, total: songs.length }
                    }))
                } catch (e) {
                    console.error(`Failed to add songs to playlist ${playlist.name}`, e)
                    setStatuses(prev => ({
                        ...prev,
                        [key]: { state: "error", matched: matchedSongs.length, failed: failedCount, total: songs.length }
                    }))
                }
            }

            setDone(true)
        } catch (e) {
            console.error("Split execution failed", e)
        } finally {
            setWorking(false)
        }
    }

    return (
        <div className="w-full max-w-screen-lg mx-auto px-5 flex-grow flex flex-col items-center pt-10">
            <h1 className="text-2xl text-center font-bold tracking-tight">
                {done ? "Done!" : "Ready to split"}
            </h1>
            <p className="text-lg text-center leading-6 mt-2 tracking-tight opacity-70 max-w-xl">
                {done
                    ? "All songs have been added to their target playlists."
                    : `${totalAssigned} songs will be distributed across ${targetPlaylists.length} playlists. The source playlists will remain unchanged.`}
            </p>

            <div className="w-full mt-8 space-y-4 mb-10">
                {targetPlaylists.map(playlist => {
                    const key = playlist.id + ":" + playlist.provider.name
                    const songs = assignments[key] || []
                    const status = statuses[key]

                    return (
                        <motion.div
                            key={key}
                            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {playlist.artworkUrl ? (
                                <img
                                    src={playlist.artworkUrl}
                                    alt={playlist.name}
                                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex-shrink-0" />
                            )}

                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2">
                                    {playlist.provider.name === "spotify" ? (
                                        <FaSpotify className="text-[#1DB954] flex-shrink-0" />
                                    ) : (
                                        <FaApple className="text-[#FA2D48] flex-shrink-0" />
                                    )}
                                    <p className="font-semibold tracking-tight truncate">{playlist.name}</p>
                                </div>
                                <p className="text-sm text-gray-500 tracking-tight">
                                    {songs.length} {songs.length === 1 ? "song" : "songs"} to add
                                    {status && status.state === "processing" && (
                                        <span className="ml-2 text-purple-600">
                                            Matching: {status.matched + status.failed}/{status.total}
                                        </span>
                                    )}
                                    {status && status.state === "done" && (
                                        <span className="ml-2 text-green-600">
                                            Added {status.matched} songs
                                            {status.failed > 0 && `, ${status.failed} not found`}
                                        </span>
                                    )}
                                    {status && status.state === "error" && (
                                        <span className="ml-2 text-red-600">Error adding songs</span>
                                    )}
                                </p>
                            </div>

                            <div className="flex-shrink-0">
                                {status?.state === "done" ? (
                                    <FaCheck className="text-green-500 text-lg" />
                                ) : status?.state === "error" ? (
                                    <FaExclamationTriangle className="text-red-500 text-lg" />
                                ) : status?.state === "processing" ? (
                                    <motion.div
                                        className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {totalAssigned > 0 && (
                <div className="w-full mb-8">
                    <h2 className="text-lg font-semibold tracking-tight mb-3">Song details</h2>
                    {targetPlaylists.map(playlist => {
                        const key = playlist.id + ":" + playlist.provider.name
                        const playlistSongs = assignments[key] || []
                        if (playlistSongs.length === 0) return null

                        return (
                            <div key={key} className="mb-4">
                                <p className="text-sm font-medium text-gray-500 mb-2">{playlist.name}</p>
                                <div className="space-y-1">
                                    {playlistSongs.map((song, i) => (
                                        <div key={song.id + song.provider.name + i} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-gray-50">
                                            {song.artworkUrl ? (
                                                <img src={song.artworkUrl} alt={song.name} className="w-8 h-8 rounded object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-gray-200" />
                                            )}
                                            <div className="min-w-0 flex-grow">
                                                <p className="text-sm font-medium truncate">{song.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {!done && (
                <FinishButton
                    onClick={execute}
                    working={working}
                    text="Add songs to playlists"
                />
            )}
        </div>
    )
}

export default SplitFinishScreen
