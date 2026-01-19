import { authorizationHeaders, getAccessToken } from "./authorization"
import { Profile, Song, SongCollection } from "../types/spotify"

export async function getProfile(): Promise<Profile | null> {
    const accessToken = getAccessToken()
    if (!accessToken) return null

    return await fetch("https://api.spotify.com/v1/me", { headers: authorizationHeaders() })
        .then(res => res.json())
        .catch(console.error)
}

export async function getSavedSongs(next?: string): Promise<Song[]> {
    const response: SongCollection = await fetch(next ?? "https://api.spotify.com/v1/me/tracks?limit=50&market=DE", {
        headers: authorizationHeaders()
    })
        .then(res => res.json())
        .catch(console.error)

    if (response.next) {
        return [...response.items, ...(await getSavedSongs(response.next))]
    }

    return response.items
}
