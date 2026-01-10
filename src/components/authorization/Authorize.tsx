import React from "react"
import AuthorizationButton from "@/components/authorization/AuthorizationButton"
import AppleAuthorizationButton from "@/components/authorization/AppleAuthorizationButton"
import { FaMusic, FaMagic, FaExchangeAlt } from "react-icons/fa"

const Authorize: React.FC = () => {
    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center px-6 py-12 max-w-screen-xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 mb-6 shadow-sm">
                    <FaMagic size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-4">Music Composer</h1>
                <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                    The ultimate bridge between your music worlds. Combine playlists from Spotify and Apple Music into one unified
                    masterpiece.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
                        <FaMusic />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Import Anywhere</h3>
                    <p className="text-neutral-500 text-sm">Select playlists from both Spotify and Apple Music simultaneously.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                        <FaMagic />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Curate with Ease</h3>
                    <p className="text-neutral-500 text-sm">Pick your favorites with an intuitive, distraction-free interface.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <FaExchangeAlt />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Cross-Platform</h3>
                    <p className="text-neutral-500 text-sm">Save your new creation back to any of your connected services.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
                <AuthorizationButton />
                <AppleAuthorizationButton />
            </div>

            <p className="mt-8 text-neutral-400 text-sm">
                Connect your accounts to get started. We never store your credentials.
            </p>
        </div>
    )
}

export default Authorize
