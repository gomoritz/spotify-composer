import React, { useEffect, useState } from "react"
import { getAllSongs } from "../../../spotify/playlists"
import { motion } from "framer-motion"

interface Props {
    includedPlaylists: string[]
}

const SongPicker: React.FC<Props> = ({ includedPlaylists }) => {
    const [songs, setSongs] = useState<any[]>([])
    const [index, setIndex] = useState(0)
    const [liked, setLiked] = useState<number[]>([])

    useEffect(() => {
        getAllSongs(includedPlaylists).then(songs => setSongs(songs))
    }, [includedPlaylists])

    const next = () => setIndex(index + 1)
    const like = () => {
        setLiked(prevState => {
            const newState = [...prevState]
            newState.push(index)
            return newState
        })
        next()
    }

    const currentSong = songs[index]
    if (!currentSong) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center mt-20">
                <div style={{ backgroundImage: `url('${currentSong.track.album.images[0].url}` }}
                     className="w-64 h-64 bg-cover mx-auto mb-5 bg-center shadow-sm"
                />
                <p className="text-lg font-semibold tracking-tight">
                    {currentSong.track.name}
                </p>
                <p className="tracking-tight">
                    {currentSong.track.artists.map((it: any) => it.name).join(", ")}
                </p>
                <div className="mt-10 flex flex-row justify-around">
                    <motion.p
                        className="mx-10 px-6 py-2 rounded-md bg-green-500 text-white cursor-pointer"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={like}
                    >
                        Like
                    </motion.p>
                    <motion.p
                        className="mx-10 px-6 py-2 rounded-md bg-red-500 text-white cursor-pointer"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={next}
                    >
                        Dislike
                    </motion.p>
                </div>
            </div>
        </div>
    )
}

export default SongPicker