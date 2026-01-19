import constants from "@/spotify/constants"
import { getCodeChallenge, getCodeVerifier } from "@/utils/pkce"

export function getAccessToken(): string | null {
    const accessToken = localStorage.getItem("access_token")
    const expiresAtString = localStorage.getItem("expires_at")

    if (!accessToken || !expiresAtString) return null

    const currentSeconds = Date.now() / 1000
    const expiresAt = parseInt(expiresAtString)

    if (isNaN(expiresAt) || currentSeconds > expiresAt) {
        console.log("Access token is expired")
        return null
    }

    return accessToken
}

export async function requestAccessTokenFromPKCE(code: string) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: constants.client_id!,
            grant_type: "authorization_code",
            redirect_uri: constants.redirect_uri,
            code_verifier: getCodeVerifier(),
            code
        })
    })

    return await response.json()
}

export function unauthorizeSpotify() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("expires_at")
}

export function authorizationHeaders() {
    return { Authorization: "Bearer " + getAccessToken() }
}

export async function authorizeSpotify() {
    window.location.href =
        "https://accounts.spotify.com/authorize" +
        "?client_id=" +
        constants.client_id +
        "&response_type=" +
        constants.response_type +
        "&redirect_uri=" +
        constants.redirect_uri +
        "&scope=" +
        constants.scopes +
        "&code_challenge_method=" +
        constants.code_challenge_method +
        "&code_challenge=" +
        (await getCodeChallenge())
}
