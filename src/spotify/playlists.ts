import { authorizationHeaders } from "./authorization"
import { getProfile } from "./profile"

export async function getPlaylists(next?: string): Promise<any[]> {
    const response: any = await fetch(
        next ?? "https://api.spotify.com/v1/me/playlists?limit=50",
        { headers: authorizationHeaders() }
    ).then(res => res.json()).catch(console.error)

    if (response.next) {
        console.log(`Got ${response.items.length}, fetching next...`)
        return [...response.items, ...await getPlaylists(response.next)]
    }

    return response.items
}

export async function getPlaylist(id: string): Promise<any> {
    return await fetch(
        "https://api.spotify.com/v1/playlists/" + id,
        { headers: authorizationHeaders() }
    ).then(res => res.json()).catch(console.error)
}

export async function getAllSongs(playlists: string[]): Promise<any[]> {
    const result: any[] = []
    const isAlreadyAdded = (song: any) => !!result.find(it =>
        it.track.id === song.track.id || it.track.external_ids.isrc === song.track.external_ids.isrc
    )

    for (let id of playlists) {
        const playlist: any = await getPlaylist(id)
        for (let song of playlist.tracks.items) {
            if (isAlreadyAdded(song)) continue
            result.push(song)
        }
    }
    return result
}

export async function createPlaylist(): Promise<any> {
    const profile = await getProfile()

    return await fetch(
        `https://api.spotify.com/v1/users/${profile.id}/playlists`,
        {
            method: "POST",
            headers: authorizationHeaders(),
            body: JSON.stringify({
                name: `${getRandomEmoji()} ${profile.display_name}'s Composed Playlist`,
                description: "🔥 Generated with the Spotify Playlist Composer by Inception Cloud. " +
                    "👉 Create your own one at composer.inceptioncloud.net!"
            })
        }
    ).then(res => res.json()).catch(console.error)
}

export async function addSongsToPlaylist(playlistId: string, songs: any[]): Promise<any> {
    return await fetch(
        "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authorizationHeaders()
            },
            body: JSON.stringify({
                uris: songs.map(song => song.track.uri)
            })
        }
    )
}

function getRandomEmoji() {
    const emojis = ["🔮", "🎵", "🎶", "🎙", "🎤", "🎧", "📯", "🎼", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎹"]
    return emojis[Math.floor(Math.random() * emojis.length)]
}