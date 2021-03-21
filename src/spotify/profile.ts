import { authorizationHeaders, getAccessToken } from "./authorization"
import { Profile } from "../types/spotify"

export async function getProfile(): Promise<Profile | null> {
    const accessToken = getAccessToken()
    if (!accessToken) return null

    return await fetch(
        "https://api.spotify.com/v1/me",
        { headers: authorizationHeaders() }
    ).then(res => res.json()).catch(console.error)
}