import React from "react"

interface Props {

}

const Header: React.FC<Props> = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center p-3 shadow-md text-center
             bg-gradient-to-br from-blue-600 to-purple-500"
        >
            <p className="text-2xl font-semibold tracking-tight text-gray-100">
                Spotify Playlist Composer
            </p>
            <p className="text-md -mt-0.5 font-light tracking-tight text-gray-200">
                by inception
            </p>
        </div>
    )
}

export default Header