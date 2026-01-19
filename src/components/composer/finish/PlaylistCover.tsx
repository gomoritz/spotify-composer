"use client"

import React, { useEffect, useRef, useState } from "react"
import { GenericSong } from "@/types/music"

type Props = {
    songs: GenericSong[]
}

const PlaylistCover: React.FC<Props> = ({ songs }) => {
    const canvasSize = 250
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [images, setImages] = useState<(string | null)[]>([])
    const [imageIndex, setImageIndex] = useState(0)
    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")!
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            if (images.length >= 4) {
                images.forEach((image, i) => {
                    if (!image) return

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
                    img.src = image!
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
                    img.src = image
                    img.addEventListener("load", () => {
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasSize, canvasSize)
                    })
                }
            }
        }
    }, [canvasRef, images])

    useEffect(() => {
        function resolveImages() {
            const uniqueImages: string[] = []
            for (let song of songs) {
                if (song.artworkUrl && !uniqueImages.includes(song.artworkUrl) && uniqueImages.length < 4) {
                    uniqueImages.push(song.artworkUrl)
                }
            }
            return uniqueImages
        }
        setImages(resolveImages())
    }, [songs])

    function changeCoverImage(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, imageUrl: string | undefined) {
        if (!imageUrl) return
        setImages(prev => {
            const prevImages = [...prev]
            prevImages[imageIndex] = imageUrl
            return prevImages
        })
        setImageIndex(index => (index === 3 ? 0 : index + 1))
    }

    return (
        <>
            <canvas
                onClick={e => changeCoverImage(e, songs[Math.floor(Math.random() * songs.length)].artworkUrl)}
                className="mx-auto"
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
            ></canvas>
        </>
    )
}
export default PlaylistCover
