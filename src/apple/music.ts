import { GenericPlaylist, GenericSong, mapAppleMusicPlaylist, mapAppleMusicSong } from "@/types/music"

export async function getAppleDeveloperToken(): Promise<string> {
    const response = await fetch("/api/apple/token")
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data.token
}

export async function initMusicKit() {
    if (typeof MusicKit === "undefined") {
        // Wait a bit if not yet loaded
        await new Promise(resolve => setTimeout(resolve, 500))
        if (typeof MusicKit === "undefined") {
            throw new Error("MusicKit JS not loaded")
        }
    }

    const instance = MusicKit.getInstance()
    if (instance && instance.developerToken && instance.api) {
        return instance
    }

    const developerToken = await getAppleDeveloperToken()
    return MusicKit.configure({
        developerToken,
        app: {
            name: "Spotify Composer",
            build: "1.0.0"
        }
    })
}

export function isAppleMusicAuthorized(): boolean {
    if (typeof MusicKit === "undefined") return false
    const instance = MusicKit.getInstance()
    return instance ? instance.isAuthorized : false
}

export async function authorizeAppleMusic() {
    const music = await initMusicKit()
    return await music.authorize()
}

export async function unauthorizeAppleMusic() {
    const music = MusicKit.getInstance()
    if (music) {
        return await music.unauthorize()
    }
}

export async function getAppleMusicPlaylists(): Promise<GenericPlaylist[]> {
    const music = await initMusicKit()
    let allPlaylists: any[] = []
    let url = "https://api.music.apple.com/v1/me/library/playlists?limit=100&sort=dateAdded"

    while (url) {
        const response = await fetchAppleMusic(url, music)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            console.error("Error fetching Apple Music playlists:", error)
            break
        }

        const data = await response.json()
        allPlaylists = [...allPlaylists, ...(data.data || [])]

        if (data.next) {
            url = data.next.startsWith("http") ? data.next : `https://api.music.apple.com${data.next}`
        } else {
            url = ""
        }
    }

    // Reverse to show newest first if sorted by dateAdded ascending
    return allPlaylists.map(mapAppleMusicPlaylist).reverse()
}

export async function getAppleMusicPlaylistTrackCount(playlistId: string): Promise<number | undefined> {
    const music = await initMusicKit()
    try {
        const response = await fetchAppleMusic(
            `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks?limit=1`,
            music
        )

        if (response.ok) {
            const data = await response.json()
            if (data.meta && typeof data.meta.total === "number") {
                return data.meta.total
            }
        }
    } catch (e) {
        console.error(`Failed to fetch track count for playlist ${playlistId}`, e)
    }
    return undefined
}

/**
 * A wrapper around fetch that adds Apple Music headers and handles rate limiting.
 */
async function fetchAppleMusic(url: string, music: any, options: RequestInit = {}): Promise<Response> {
    const makeRequest = () =>
        fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${music.developerToken}`,
                "Music-User-Token": music.musicUserToken,
                ...options.headers
            }
        })

    let response = await makeRequest()

    // Handle rate limiting (429 Too Many Requests)
    if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000
        await new Promise(resolve => setTimeout(resolve, waitTime))
        response = await makeRequest()
    }

    return response
}

export async function getAppleMusicPlaylistTracks(id: string): Promise<GenericSong[]> {
    const music = await initMusicKit()
    let allTracks: any[] = []
    let url = `https://api.music.apple.com/v1/me/library/playlists/${id}/tracks?limit=100&include=catalog`

    while (url) {
        const response = await fetchAppleMusic(url, music)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            console.error(`Error fetching Apple Music playlist tracks for ${id}:`, error)
            break
        }

        const data = await response.json()
        allTracks = [...allTracks, ...(data.data || [])]

        if (data.next) {
            url = data.next.startsWith("http") ? data.next : `https://api.music.apple.com${data.next}`
        } else {
            url = ""
        }
    }

    return allTracks.map(mapAppleMusicSong)
}

export async function getAppleMusicSavedSongs(): Promise<GenericSong[]> {
    const music = await initMusicKit()
    let allSongs: any[] = []
    let url = "https://api.music.apple.com/v1/me/library/songs?limit=100&include=catalog"

    while (url) {
        const response = await fetchAppleMusic(url, music)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            console.error("Error fetching Apple Music saved songs:", error)
            break
        }

        const data = await response.json()
        allSongs = [...allSongs, ...(data.data || [])]

        if (data.next) {
            url = data.next.startsWith("http") ? data.next : `https://api.music.apple.com${data.next}`
        } else {
            url = ""
        }
    }

    return allSongs.map(mapAppleMusicSong)
}

export async function createAppleMusicPlaylist(name: string, description: string): Promise<string> {
    const music = await initMusicKit()
    const response = await fetchAppleMusic("https://api.music.apple.com/v1/me/library/playlists", music, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            attributes: {
                name,
                description
            }
        })
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.errors?.[0]?.detail || "Failed to create Apple Music playlist")
    }

    return data.data[0].id
}

export async function addSongsToAppleMusicPlaylist(playlistId: string, songs: GenericSong[]): Promise<void> {
    const music = await initMusicKit()
    const trackData = songs.map(song => ({
        id: song.id,
        type: "songs"
    }))
    const response = await fetchAppleMusic(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`, music, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: trackData
        })
    })

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.errors?.[0]?.detail || "Failed to add songs to Apple Music playlist")
    }
}
