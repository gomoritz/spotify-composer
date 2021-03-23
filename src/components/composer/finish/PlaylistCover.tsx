import React, { useEffect, useRef, useState } from "react"
import { AlbumImage, Song } from "../../../types/spotify"

type Props = {
    songs: Song[]
}

const PlaylistCover: React.FC<Props> = ({ songs }) => {
    const canvasSize = 250
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [images, setImages] = useState<AlbumImage[]>([])
    const [imageIndex, setImageIndex] = useState(0)
    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")!
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            if (images.length >= 4) {
                images.forEach((image, i) => {
                    let left = 0
                    let top = 0
                    if (i <= 1) left = i * (canvasSize / 2)
                    else if (i === 2) top = canvasSize / 2
                    else if (i === 3) {
                        top = canvasSize / 2
                        left = canvasSize / 2
                    }
                    const img = document.createElement("img")
                    img.crossOrigin = "anonymous"
                    img.src = image.url
                    img.addEventListener("load", () => {
                        ctx.drawImage(img, 0, 0, img.width, img.height, left, top, canvasSize / 2, canvasSize / 2)
                    })
                })
            } else {
                console.log("Got else", images)
                const image = images[0]
                if (image) {
                    const img = document.createElement("img")
                    img.crossOrigin = "anonymous"
                    img.src = image.url
                    img.addEventListener("load", () => {
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasSize, canvasSize)
                    })
                }
            }
        }
    }, [canvasRef, images])

    useEffect(() => {
        function resolveImages() {
            const uniqueSongs: Song[] = []
            for (let song of songs) {
                if (!uniqueSongs.find(it => it.track.album.id === song.track.album.id) && uniqueSongs.length < 4) {
                    uniqueSongs.push(song)
                }
            }
            return uniqueSongs.map(item => item.track.album.images[0]) as AlbumImage[]
        }
        setImages(resolveImages())
    }, [songs])

    function changeCoverImage(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, image: AlbumImage) {
        console.log("Set image:", image)
        console.log(imageIndex)
        setImages(prev => {
            const prevImages = [...prev]
            prevImages[imageIndex] = image
            return prevImages
        })
        setImageIndex(index => (index === 3 ? 0 : index + 1))
    }

    return (
        <>
            <canvas
                onClick={e =>
                    changeCoverImage(e, songs[Math.floor(Math.random() * songs.length)].track.album.images[0])
                }
                className="mx-auto"
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
            ></canvas>
        </>
    )
}
export default PlaylistCover
