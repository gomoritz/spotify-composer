"use client"

import React, { useState, useEffect } from "react"
import { Reorder } from "motion/react"
import SongItem from "@/components/composer/finish/SongItem"
import FinishButton from "@/components/composer/finish/FinishButton"
import PlaylistCover from "@/components/composer/finish/PlaylistCover"
import { addSongsToPlaylist, createPlaylist, searchSpotifyByISRC, searchSpotifyByMetadata } from "@/spotify/playlists"
import { GenericSong } from "@/types/music"
import { getAccessToken } from "@/spotify/authorization"
import {
    addSongsToAppleMusicPlaylist,
    createAppleMusicPlaylist,
    isAppleMusicAuthorized,
    getAppleMusicSongByISRC,
    searchAppleMusicByMetadata
} from "@/apple/music"
import { FaSpotify, FaApple, FaSearch, FaCheck, FaExclamationTriangle } from "react-icons/fa"
import { motion, AnimatePresence } from "motion/react"

interface Props {
    songs: GenericSong[]
}

const FinishScreen: React.FC<Props> = ({ songs }) => {
    const [working, setWorking] = useState(false)
    const [order, setOrder] = useState(songs)
    const [destination, setDestination] = useState<"spotify" | "apple-music">("spotify")
    const [analysisResults, setAnalysisResults] = useState<{
        matched: number
        failed: GenericSong[]
        matchingSongs: GenericSong[]
    } | null>(null)
    const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set())
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        setOrder(songs)
        if (!getAccessToken() && isAppleMusicAuthorized()) {
            setDestination("apple-music")
        }
    }, [songs])

    // Reset analysis when destination or order changes
    useEffect(() => {
        setAnalysisResults(null)
        setAnalyzingIds(new Set())
        setMatchedIds(new Set())
    }, [destination, order])

    async function analyze() {
        if (working) return
        setWorking(true)
        setAnalyzingIds(new Set())
        setMatchedIds(new Set())

        const matchingSongs: GenericSong[] = []
        const failed: GenericSong[] = []
        let matchedCount = 0

        try {
            for (const song of order) {
                const songKey = song.id + song.provider.name
                setAnalyzingIds(prev => new Set(prev).add(songKey))

                if (song.provider.name === destination) {
                    matchingSongs.push(song)
                    matchedCount++
                    setMatchedIds(prev => new Set(prev).add(songKey))
                    setAnalyzingIds(prev => {
                        const next = new Set(prev)
                        next.delete(songKey)
                        return next
                    })
                    continue
                }

                try {
                    let found = false
                    if (destination === "spotify") {
                        let uri = song.isrc ? await searchSpotifyByISRC(song.isrc, song.album) : null

                        // Fallback to metadata search
                        if (!uri) {
                            uri = await searchSpotifyByMetadata(song.name, song.artist, song.album)
                        }

                        if (uri) {
                            matchingSongs.push({ ...song, uri, provider: { name: "spotify", id: "spotify" } })
                            matchedCount++
                            found = true
                        } else {
                            failed.push(song)
                        }
                    } else {
                        let amSong = song.isrc ? await getAppleMusicSongByISRC(song.isrc, song.album) : null

                        // Fallback to metadata search
                        if (!amSong) {
                            amSong = await searchAppleMusicByMetadata(song.name, song.artist, song.album)
                        }

                        if (amSong) {
                            matchingSongs.push(amSong)
                            matchedCount++
                            found = true
                        } else {
                            failed.push(song)
                        }
                    }

                    if (found) {
                        setMatchedIds(prev => new Set(prev).add(songKey))
                    }
                } catch (e) {
                    console.error("Match error for song", song.name, e)
                    failed.push(song)
                } finally {
                    setAnalyzingIds(prev => {
                        const next = new Set(prev)
                        next.delete(songKey)
                        return next
                    })
                }
            }

            setAnalysisResults({
                matched: matchedCount,
                failed,
                matchingSongs
            })
        } catch (e) {
            console.error("Analysis failed", e)
            alert("Failed to analyze songs")
        } finally {
            setWorking(false)
        }
    }

    async function finish() {
        if (!analysisResults) {
            await analyze()
            return
        }

        if (working) return
        setWorking(true)

        const name = "🪄 My Composed Playlist"
        const description = "Generated with Music Composer"

        try {
            if (destination === "spotify") {
                const playlist = await createPlaylist()
                await addSongsToPlaylist(playlist.id, analysisResults.matchingSongs)
            } else {
                const playlistId = await createAppleMusicPlaylist(name, description)
                await addSongsToAppleMusicPlaylist(playlistId, analysisResults.matchingSongs)
            }
            alert("Playlist created successfully!")
        } catch (e) {
            console.error(e)
            alert("Failed to create playlist")
        } finally {
            setWorking(false)
        }
    }

    const canSpotify = !!getAccessToken()
    const canApple = isAppleMusicAuthorized()

    return (
        <div className="w-full max-w-screen-lg mx-auto px-5 flex-grow flex flex-col items-center pt-10">
            <h1 className="text-2xl text-center font-bold tracking-tight">🎉 You&apos;re done!</h1>
            <p className="text-lg text-center leading-6 mt-2 tracking-tight opacity-70 max-w-xl">
                A new playlist has been built based on the
                <span className="font-semibold">
                    {" "}
                    {songs.length} {songs.length === 1 ? "song " : "songs "}
                </span>
                you selected. You can create the playlist by clicking the button below.
            </p>

            {canSpotify && canApple ? (
                <div className="mt-8 flex flex-col items-center">
                    <p className="text-sm font-medium uppercase tracking-wider opacity-60 mb-3">Choose Destination Service</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDestination("spotify")}
                            className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                                destination === "spotify"
                                    ? "bg-[#1DB954] text-white shadow-md scale-105"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <FaSpotify className={destination === "spotify" ? "text-white" : "text-[#1DB954]"} />
                            <span className="font-semibold">Spotify</span>
                        </button>
                        <button
                            onClick={() => setDestination("apple-music")}
                            className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                                destination === "apple-music"
                                    ? "bg-[#FA2D48] text-white shadow-md scale-105"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <FaApple className={destination === "apple-music" ? "text-white" : "text-[#FA2D48]"} />
                            <span className="font-semibold">Apple Music</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-8 flex flex-col items-center">
                    <p className="text-sm font-medium uppercase tracking-wider opacity-60 mb-3">Destination Service</p>
                    <div className="px-6 py-2.5 rounded-full flex items-center gap-2 bg-white text-gray-600 border border-gray-200">
                        {canSpotify ? (
                            <>
                                <FaSpotify className="text-[#1DB954]" />
                                <span className="font-semibold text-neutral-800">Spotify</span>
                            </>
                        ) : (
                            <>
                                <FaApple className="text-[#FA2D48]" />
                                <span className="font-semibold text-neutral-800">Apple Music</span>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-5">
                <PlaylistCover songs={order} />
            </div>

            <Reorder.Group axis="y" values={order} onReorder={setOrder} className="w-full my-10">
                {order.map((song: GenericSong) => {
                    const songKey = song.id + song.provider.name
                    const isFailed = analysisResults?.failed.some(f => f.id === song.id && f.provider.name === song.provider.name)
                    const isAnalyzing = analyzingIds.has(songKey)
                    const isMatched = matchedIds.has(songKey)

                    return (
                        <Reorder.Item key={songKey} value={song}>
                            <SongItem song={song} isFailed={isFailed} isAnalyzing={isAnalyzing} isMatched={isMatched} />
                        </Reorder.Item>
                    )
                })}
            </Reorder.Group>

            <FinishButton
                onClick={finish}
                working={working}
                text={
                    !analysisResults
                        ? `Analyze for ${destination === "spotify" ? "Spotify" : "Apple Music"}`
                        : `Create ${destination === "spotify" ? "Spotify" : "Apple Music"} Playlist`
                }
            />
        </div>
    )
}

export default FinishScreen
