"use client"

import { useEffect, useState } from "react"
import { requestAccessTokenFromPKCE } from "@/spotify/authorization"

export default function AuthorizationCallbackPage() {
    const [authorizationState, setAuthorizationState] = useState("Authorizing...")

    useEffect(() => {
        ;(async () => {
            const queryParams = new URLSearchParams(window.location.search)

            if (queryParams.has("error")) {
                setAuthorizationState("Access denied")
                return
            }

            const code = queryParams.get("code")
            if (!code) {
                setAuthorizationState("Cannot retrieve authorization code")
            }

            const { access_token: accessToken, expires_in: expiresIn } = await requestAccessTokenFromPKCE(code!)
            if (!accessToken || !expiresIn) {
                setAuthorizationState("Cannot request access token with code")
                return
            }

            const currentSeconds = Date.now() / 1000
            const expiresAt = currentSeconds + parseInt(expiresIn)

            localStorage.setItem("access_token", accessToken)
            localStorage.setItem("expires_at", String(expiresAt))
            setAuthorizationState("Success!")

            window.location.href = "/"
        })()
    }, [])

    return <div className="flex justify-center items-center flex-grow">{authorizationState}</div>
}
