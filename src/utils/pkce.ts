function generateRandomString(length: number) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

function sha256(plain: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest("SHA-256", data)
}

const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input) as any))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
}

export function getCodeVerifier() {
    const local = localStorage.getItem("pkce-code-verifier")
    if (local) return local

    const codeVerifier = generateRandomString(128)
    localStorage.setItem("pkce-code-verifier", codeVerifier)
    return codeVerifier
}

export async function getCodeChallenge() {
    const hashed = await sha256(getCodeVerifier())
    return base64encode(hashed)
}
