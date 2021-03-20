import { authorizationHeaders } from "./authorization"

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
    const isAlreadyAdded = (song: any) => !!result.find(it => it.track.id === song.track.id)

    for (let id of playlists) {
        const playlist: any = await getPlaylist(id)
        for (let song of playlist.tracks.items) {
            if (isAlreadyAdded(song)) continue
            result.push(song)
        }
    }
    return result
}