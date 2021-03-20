import React from "react"
import SongItem from "./SongItem"
import { motion } from "framer-motion"
import { addSongsToPlaylist, createPlaylist } from "../../../spotify/playlists"

interface Props {
    songs: any[]
}

const FinishScreen: React.FC<Props> = ({ songs }) => {
    function finish() {
        createPlaylist().then(playlist => {
            addSongsToPlaylist(playlist.id, songs).then(() => {
                console.info("done!")
            })
        })
    }

    return (
        <div className="w-full flex-grow flex flex-col items-center pt-10">
            <h1 className="text-2xl text-center font-bold tracking-tight">🎉 You're done!</h1>
            <p className="text-lg text-center leading-6 mt-2 tracking-tight opacity-70 max-w-xl">
                A new playlist has been built based on the
                <span className="font-semibold"> {songs.length} {songs.length === 0 ? "song " : "songs "}</span>
                you selected. You can create the playlist by clicking the button below.
            </p>
            <div className="w-full px-10 my-10">
                {songs.map(song => <SongItem song={song}/>)}
            </div>
            <motion.div
                className="sticky bottom-6 left-0 mx-auto px-5 py-2 bg-emerald-500 text-white text-lg
                shadow-md rounded-lg cursor-pointer border-2 border-emerald-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={finish}
            >
                Create Playlist
            </motion.div>
        </div>
    )
}

export default FinishScreen