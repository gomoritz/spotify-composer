import { ReactNode } from "react"
import Header from "@/components/Header"
import "../styles/globals.css"
import Script from "next/script"

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <Script src="https://js-cdn.music.apple.com/musickit/v3/musickit.js" strategy="beforeInteractive" />
            </head>
            <body>
                <div className="w-full min-h-screen h-full select-none flex flex-col bg-neutral-50">
                    <Header />
                    <main className="flex-grow flex flex-col">{children}</main>
                </div>
            </body>
        </html>
    )
}
