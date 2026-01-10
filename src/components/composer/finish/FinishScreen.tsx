"use client"

import React, { useState, useEffect } from "react"
import { Reorder } from "motion/react"
import SongItem from "@/components/composer/finish/SongItem"
import FinishButton from "@/components/composer/finish/FinishButton"
import PlaylistCover from "@/components/composer/finish/PlaylistCover"
import { addSongsToPlaylist, createPlaylist } from "@/spotify/playlists"
import { GenericSong } from "@/types/music"
import { getAccessToken } from "@/spotify/authorization"
import { addSongsToAppleMusicPlaylist, createAppleMusicPlaylist, isAppleMusicAuthorized } from "@/apple/music"

interface Props {
    songs: GenericSong[]
}

const FinishScreen: React.FC<Props> = ({ songs }) => {
    const [working, setWorking] = useState(false)
    const [order, setOrder] = useState(songs)
    const [destination, setDestination] = useState<"spotify" | "apple-music">("spotify")

    useEffect(() => {
        setOrder(songs)
        if (!getAccessToken() && isAppleMusicAuthorized()) {
            setDestination("apple-music")
        }
    }, [songs])

    async function finish() {
        if (working) return
        setWorking(true)

        const name = "🪄 My Composed Playlist"
        const description = "Generated with Spotify Composer"

        try {
            if (destination === "spotify") {
                const playlist = await createPlaylist()
                await addSongsToPlaylist(playlist.id, order)
            } else {
                const playlistId = await createAppleMusicPlaylist(name, description)
                await addSongsToAppleMusicPlaylist(playlistId, order)
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

            {canSpotify && canApple && (
                <div className="mt-5 flex gap-4">
                    <button
                        onClick={() => setDestination("spotify")}
                        className={`px-4 py-2 rounded-md ${
                            destination === "spotify" ? "bg-emerald-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Save to Spotify
                    </button>
                    <button
                        onClick={() => setDestination("apple-music")}
                        className={`px-4 py-2 rounded-md ${
                            destination === "apple-music" ? "bg-red-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Save to Apple Music
                    </button>
                </div>
            )}

            <div className="mt-5">
                <PlaylistCover songs={order} />
            </div>
            <Reorder.Group axis="y" values={order} onReorder={setOrder} className="w-full my-10">
                {order.map((song: GenericSong) => (
                    <Reorder.Item key={song.id + song.provider.name} value={song}>
                        <SongItem song={song} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <FinishButton
                onClick={finish}
                working={working}
                text={destination === "spotify" ? "Save to Spotify" : "Save to Apple Music"}
            />
        </div>
    )
}

export default FinishScreen
