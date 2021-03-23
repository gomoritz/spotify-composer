import React from "react"
import AuthorizationButton from "@components/authorization/AuthorizationButton"

const Authorize: React.FC = () => {
    return (
        <div className="w-full flex-grow flex justify-center items-center">
            <AuthorizationButton/>
        </div>
    )
}

export default Authorize