import React from "react"
import { motion, Variants } from "motion/react"
import DialogButton from "@/components/composer/song/DialogButton"
import { Song } from "@/types/spotify"

type Props = {
    setVisible(value: boolean): void
    isVisible: boolean

    setSongs: React.Dispatch<React.SetStateAction<Song[] | undefined>>
    setTaken: React.Dispatch<React.SetStateAction<number[]>>
    setIndex: React.Dispatch<React.SetStateAction<number>>
    index: number

    takeRemaining: () => void
    dropRemaining: () => void
}

const SongOptionsDialog: React.FC<Props> = ({
    isVisible,
    setVisible,
    setSongs,
    index,
    setIndex,
    setTaken,
    takeRemaining,
    dropRemaining
}) => {
    const backgroundVariants: Variants = {
        visible: {
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "block"
        },
        hidden: {
            backgroundColor: "rgba(0,0,0,0.0)",
            transitionEnd: {
                display: "none"
            }
        }
    }

    const dialogVariants: Variants = {
        visible: {
            scale: 1,
            opacity: 1
        },
        hidden: {
            scale: 0.5,
            opacity: 0,
            transition: {
                type: "spring"
            }
        }
    }

    function manipulateRemaining(action: (input: Song[]) => Song[]) {
        setSongs(prev => {
            const done = prev!.slice(0, index)
            const remaining = prev!.slice(index)
            const manipulated = action(remaining)

            return [...done, ...manipulated]
        })
    }

    function sortBy(transform: (song: Song) => string | number) {
        manipulateRemaining(input =>
            [...input].sort((a, b) => {
                const ta = transform(a)
                const tb = transform(b)
                return typeof ta === "string" && typeof tb === "string" ? ta.localeCompare(tb) : tb > ta ? 1 : tb < ta ? -1 : 0
            })
        )
    }

    const shuffle = () => manipulateRemaining(input => shuffleArray([...input]))
    const sortByArtist = () => sortBy(song => song.track.artists[0].name)
    const sortByTitle = () => sortBy(song => song.track.name)
    const sortByPopularity = () => sortBy(song => song.track.popularity)
    const reverse = () => manipulateRemaining(input => input.reverse())

    const restart = () => {
        setIndex(0)
        setTaken([])
        setVisible(false)
    }

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full z-50"
            variants={backgroundVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
        >
            <div className="mx-auto max-w-screen-lg h-full flex justify-center items-center">
                <motion.div
                    className="bg-trueGray-100 shadow-lg rounded-lg flex flex-col w-1/2 text-center px-10 py-7"
                    variants={dialogVariants}
                >
                    <h1 className="text-xl font-semibold tracking-tight mb-4">Manipulate order</h1>
                    <div className="w-full grid grid-rows-2 grid-cols-2 gap-x-4 gap-y-2 justify-items-center">
                        <DialogButton className="mr-2 mb-2 w-full" onClick={shuffle}>
                            Shuffle
                        </DialogButton>
                        <DialogButton className="mr-2 mb-2 w-full" onClick={sortByArtist}>
                            Sort by artist
                        </DialogButton>
                        <DialogButton className="mb-2 mr-2 w-full" onClick={sortByTitle}>
                            Sort by title
                        </DialogButton>
                        <DialogButton className="mb-2 mr-2 w-full" onClick={sortByPopularity}>
                            Sort by popularity
                        </DialogButton>
                        <DialogButton className="mb-2 mr-2 w-full" onClick={takeRemaining}>
                            Take remaining songs
                        </DialogButton>
                        <DialogButton className="mb-2 mr-2 w-full" onClick={dropRemaining}>
                            Drop remaining songs
                        </DialogButton>
                        <DialogButton className="mb-2 mr-2 w-full" onClick={reverse}>
                            Reverse order
                        </DialogButton>
                    </div>

                    <DialogButton onClick={restart} dangerous className="w-full mt-2 mt-5">
                        Reset progress and restart
                    </DialogButton>
                    <DialogButton onClick={() => setVisible(false)} primary className="w-full mt-2">
                        Close
                    </DialogButton>
                </motion.div>
            </div>
        </motion.div>
    )
}

/**
 * Shuffles the given array in place.
 */
function shuffleArray<T>(a: T[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export default SongOptionsDialog
