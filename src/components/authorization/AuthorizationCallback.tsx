import React, { useEffect, useState } from "react"

const previewIdRegex = /[a-zA-Z0-9]{10}/

const AuthorizationCallback: React.FC = () => {
    const [authorizationState, setAuthorizationState] = useState("Authorizing...")

    useEffect(() => {
        const hash = window.location.hash
        const queryParams = new URLSearchParams(window.location.search)

        if (queryParams.has("error")) {
            setAuthorizationState("Access denied")
            return
        }

        const parsed = hash.substr(1, hash.length - 1)
        const hashParams = new URLSearchParams(parsed)

        const accessToken = hashParams.get("access_token")
        const expiresIn = hashParams.get("expires_in")

        if (!accessToken || !expiresIn) {
            setAuthorizationState("Cannot retrieve access token")
            return
        }

        const previewRedirect = hashParams.get("state")
        if (previewRedirect && previewIdRegex.test(previewRedirect)) {
            setAuthorizationState("Redirecting to preview...")
            window.location.replace(`https://${previewRedirect}.preview.composer.incxption.dev/authorization_callback${hash}`)
            return
        }

        const currentSeconds = Date.now() / 1000
        const expiresAt = currentSeconds + parseInt(expiresIn)

        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("expires_at", String(expiresAt))
        setAuthorizationState("Success!")

        window.location.hash = ""
        window.location.pathname = "/"
    }, [])

    return (
        <div className="flex justify-center items-center flex-grow">
            {authorizationState}
        </div>
    )
}

export default AuthorizationCallback
