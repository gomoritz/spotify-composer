"use client"
import { useState, useEffect } from "react"
import Composer from "@/components/composer/Composer"
import Splitter from "@/components/splitter/Splitter"
import Authorize from "@/components/authorization/Authorize"
import { getAccessToken } from "@/spotify/authorization"
import { isAppleMusicAuthorized, initMusicKit } from "@/apple/music"
import ModeSelection from "@/components/ModeSelection"

export default function HomePage() {
    const [hasAuthorization, setHasAuthorization] = useState<boolean | null>(null)
    const [mode, setMode] = useState<"compose" | "split" | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const spotifyAuth = !!getAccessToken()

            // Initialize MusicKit to check its auth status
            let appleAuth = false
            try {
                await initMusicKit()
                appleAuth = isAppleMusicAuthorized()
            } catch (e) {
                console.error("Failed to init MusicKit", e)
            }

            setHasAuthorization(spotifyAuth || appleAuth)
        }

        checkAuth()
    }, [])

    if (hasAuthorization === null) {
        return null // or a loading spinner
    }

    if (!hasAuthorization) {
        return <Authorize />
    }

    if (!mode) {
        return <ModeSelection setMode={setMode} />
    }

    if (mode === "split") {
        return <Splitter />
    }

    return <Composer />
}
