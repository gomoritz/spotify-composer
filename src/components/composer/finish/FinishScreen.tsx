import React, { useEffect, useState } from "react"
import SongItem from "./SongItem"
import { addSongsToPlaylist, createPlaylist } from "../../../spotify/playlists"
import FinishButton from "./FinishButton"
import { Song } from "../../../types/spotify"
import PlaylistCover from "./PlaylistCover"
import DragItem from "../../DragItem"
import { usePositionReorder } from "../../../utils/usePositionReorder"

interface Props {
    songs: Song[]
}

const FinishScreen: React.FC<Props> = ({ songs }) => {
    const [working, setWorking] = useState(false)
    const [order, updatePosition, updateOrder] = usePositionReorder(songs)

    useEffect(() => {
        console.log(
            "The order:",
            order.map((o: Song) => o.track.name)
        )
    }, [order])
    function finish() {
        if (working) return
        setWorking(true)

        const error = (error: any) => {
            console.error(error)
            setWorking(false)
        }

        createPlaylist()
            .then(playlist => {
                addSongsToPlaylist(playlist.id, order).catch(error)
            })
            .catch(error)
    }

    return (
        <div className="w-full max-w-screen-lg mx-auto px-5 flex-grow flex flex-col items-center pt-10">
            <h1 className="text-2xl text-center font-bold tracking-tight">🎉 You're done!</h1>
            <p className="text-lg text-center leading-6 mt-2 tracking-tight opacity-70 max-w-xl">
                A new playlist has been built based on the
                <span className="font-semibold">
                    {" "}
                    {songs.length} {songs.length === 0 ? "song " : "songs "}
                </span>
                you selected. You can create the playlist by clicking the button below.
            </p>
            <div className="mt-5">
                <PlaylistCover songs={order} />
            </div>
            <div className="w-full my-10 ">
                {order.map((song: Song, i: number) => (
                    <DragItem i={i} key={song.track.id} updateOrder={updateOrder} updatePosition={updatePosition}>
                        <SongItem song={song} />
                    </DragItem>
                ))}
            </div>
            <FinishButton onClick={finish} working={working} />
        </div>
    )
}

export default FinishScreen
