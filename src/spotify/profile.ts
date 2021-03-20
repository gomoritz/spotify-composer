import { authorizationHeaders, getAccessToken } from "./authorization"

export async function getProfile(): Promise<any | null> {
    const accessToken = getAccessToken()
    if (!accessToken) return null

    return await fetch(
        "https://api.spotify.com/v1/me",
        { headers: authorizationHeaders() }
    ).then(res => res.json()).catch(console.error)
}