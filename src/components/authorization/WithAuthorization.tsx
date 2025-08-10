import React from "react"
import Authorize from "@components/authorization/Authorize"
import { getAccessToken } from "@spotify/authorization"

type WithAuthorizationProps = { children?: React.ReactNode }

const WithAuthorization: React.FC<WithAuthorizationProps> = ({ children }) => {
    return getAccessToken() ? <>{children}</> : <Authorize />
}

export default WithAuthorization
