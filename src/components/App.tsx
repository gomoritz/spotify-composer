import React from "react"
import Header from "@components/Header"
import WithAuthorization from "@components/authorization/WithAuthorization"
import Composer from "@components/composer/Composer"

const App: React.FC = () => {
    return (
        <div className="w-full min-h-screen h-full select-none flex flex-col bg-neutral-50">
            <Header />
            <WithAuthorization>
                <Composer />
            </WithAuthorization>
        </div>
    )
}

export default App

