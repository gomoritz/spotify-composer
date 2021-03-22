import React from "react"
import Authorize from "@components/Authorize"
import { getAccessToken } from "@spotify/authorization"

const WithAuthorization: React.FC = ({ children }) => {
    return getAccessToken() ? <>{children}</> : <Authorize/>
}

export default WithAuthorization