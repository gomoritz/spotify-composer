"use client"
import { useState, useEffect } from "react"
import Composer from "@/components/composer/Composer"
import Authorize from "@/components/authorization/Authorize"
import { getAccessToken } from "@/spotify/authorization"
import { isAppleMusicAuthorized, initMusicKit } from "@/apple/music"

export default function HomePage() {
    const [hasAuthorization, setHasAuthorization] = useState<boolean | null>(null)

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

    return <Composer />
}
