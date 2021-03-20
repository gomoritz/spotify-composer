import React from "react"
import AuthorizationButton from "./AuthorizationButton"

const Authorize: React.FC = () => {
    return (
        <div className="w-full flex-grow flex justify-center items-center">
            <AuthorizationButton/>
        </div>
    )
}

export default Authorize