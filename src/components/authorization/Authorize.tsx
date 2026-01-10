import React from "react"
import AuthorizationButton from "@/components/authorization/AuthorizationButton"
import AppleAuthorizationButton from "@/components/authorization/AppleAuthorizationButton"

const Authorize: React.FC = () => {
    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center gap-4">
            <AuthorizationButton />
            <AppleAuthorizationButton />
        </div>
    )
}

export default Authorize
