import React from "react"
import { getAccessToken } from "../../spotify/authorization"
import Authorize from "./Authorize"

const WithAuthorization: React.FC = ({ children }) => {
    return getAccessToken() ? <>{children}</> : <Authorize/>
}

export default WithAuthorization