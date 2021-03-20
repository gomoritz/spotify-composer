import React, { useEffect, useState } from "react"

const AuthorizationCallback: React.FC = () => {
    const [authorizationState, setAuthorizationState] = useState("Authorizing...")

    useEffect(() => {
        const hash = window.location.hash
        const query = window.location.search

        if (query.length > 0) {
            setAuthorizationState("Access denied")
        } else {
            const parsed = hash.substr(1, hash.length - 1)
            const params = new URLSearchParams(parsed)

            const accessToken = params.get("access_token")
            const expiresIn = params.get("expires_in")

            if (accessToken && expiresIn) {
                const currentSeconds = Date.now() / 1000
                const expiresAt = currentSeconds + parseInt(expiresIn)

                localStorage.setItem("access_token", accessToken)
                localStorage.setItem("expires_at", String(expiresAt))
                setAuthorizationState("Success!")
                window.location.hash = ""
                window.location.pathname = "/"
            } else {
                setAuthorizationState("Cannot retrieve access token")
            }
        }
    }, [])

    return (
        <div className="flex justify-center items-center flex-grow">
            {authorizationState}
        </div>
    )
}

export default AuthorizationCallback