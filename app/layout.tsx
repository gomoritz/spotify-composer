import "./globals.css"
export const metadata = {
    title: "Spotify Composer",
    description: "Mix multiple Spotify playlists with swipe-based selection",
    manifest: "/manifest.json"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-neutral-50">
                <div id="root">{children}</div>
            </body>
        </html>
    )
}

