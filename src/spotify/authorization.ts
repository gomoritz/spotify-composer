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

export function authorizationHeaders() {
    return { "Authorization": "Bearer " + getAccessToken() }
}