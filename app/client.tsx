"use client"

import dynamic from "next/dynamic"
import "./globals.css"

const App = dynamic(() => import("../src/components/App"), { ssr: false })

export function ClientOnly() {
    return <App />
}

