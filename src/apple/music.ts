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
    const response: any = await music.api.music("v1/me/library/playlists", { limit: 100 })
    return (response.data.data || []).map(mapAppleMusicPlaylist)
}

export async function getAppleMusicPlaylistTracks(id: string): Promise<GenericSong[]> {
    const music = await initMusicKit()
    const response: any = await music.api.music(`v1/me/library/playlists/${id}/tracks`, { limit: 100 })
    return (response.data.data || []).map(mapAppleMusicSong)
}

export async function getAppleMusicSavedSongs(): Promise<GenericSong[]> {
    const music = await initMusicKit()
    const response: any = await music.api.music("v1/me/library/songs", { limit: 100 })
    return (response.data.data || []).map(mapAppleMusicSong)
}

export async function createAppleMusicPlaylist(name: string, description: string): Promise<string> {
    const music = await initMusicKit()
    const response = await fetch("https://api.music.apple.com/v1/me/library/playlists", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${music.developerToken}`,
            "Music-User-Token": music.musicUserToken,
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

    const response = await fetch(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${music.developerToken}`,
            "Music-User-Token": music.musicUserToken,
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
