import { authorizationHeaders } from "./authorization"
import { getProfile, getSavedSongs } from "./profile"
import { Image, Playlist, PlaylistCollection, Song, SongCollection } from "@/types/spotify"
import { GenericSong } from "@/types/music"

export async function getPlaylists(next?: string): Promise<Playlist[]> {
    const response: PlaylistCollection = await fetch(next ?? "https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: authorizationHeaders()
    })
        .then(res => res.json())
        .catch(console.error)

    if (response.next) {
        return [...response.items, ...(await getPlaylists(response.next))]
    }

    return response.items
}

export async function getPlaylistTracks(id: string, next?: string): Promise<Song[]> {
    const response: SongCollection = await fetch(next ?? `https://api.spotify.com/v1/playlists/${id}/tracks?market=DE`, {
        headers: authorizationHeaders()
    })
        .then(res => res.json())
        .catch(console.error)

    if (response.next) {
        return [...response.items, ...(await getPlaylistTracks(id, response.next))]
    }

    return response.items
}

export async function buildPseudoPlaylistFromLibrary(): Promise<Playlist> {
    const profile = (await getProfile())!
    const items = (await getSavedSongs())!

    const images: Image[] = []
    if (profile.images.length > 0) {
        images.push(profile.images[0])
    } else {
        for (let song of items) {
            const albumImage = song.track.album.images[0]
            if (albumImage) {
                images.push(albumImage)
                break
            }
        }
    }

    return {
        id: "library-pseudo",
        name: "Your library",
        owner: { id: profile.id },
        tracks: {
            items,
            total: items.length
        },
        images
    }
}

export interface SongLoadingState {
    songs: number
    playlist: Playlist
}

export async function collectSongs(playlists: Playlist[], loadingCallback: (state: SongLoadingState) => void): Promise<Song[]> {
    const result: Song[] = []
    const isAlreadyAdded = (song: Song) =>
        !!result.find(it => it.track.id === song.track.id || it.track.external_ids.isrc === song.track.external_ids.isrc)

    for (let playlist of playlists) {
        const songs = playlist.id === "library-pseudo" ? playlist.tracks.items : await getPlaylistTracks(playlist.id)

        for (let song of songs) {
            if (!song.track) continue
            if (isAlreadyAdded(song)) continue
            if (song.is_local || song.track.is_local) continue
            result.push(song)
        }

        loadingCallback({ songs: result.length, playlist })
    }
    return result
}

export async function createPlaylist(): Promise<Playlist> {
    const profile = await getProfile()
    if (!profile) throw new Error("User is not authenticated")

    return await fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
        method: "POST",
        headers: authorizationHeaders(),
        body: JSON.stringify({
            name: `${getRandomEmoji()} ${profile.display_name}'s Composed Playlist`,
            description:
                "🔥 Generated with the Music Composer by incxption. 👉 Create your own one at spotify-composer.vercel.app!"
        })
    })
        .then(res => res.json())
        .catch(console.error)
}

export async function addSongsToPlaylist(playlistId: string, songs: GenericSong[]): Promise<any> {
    const copy = [...songs]
    const fractions: GenericSong[][] = []
    const promises: Promise<any>[] = []

    while (copy.length > 0) {
        fractions.push(copy.splice(0, 100))
    }

    for (let fraction of fractions) {
        promises.push(
            fetch("https://api.spotify.com/v1/playlists/" + playlistId + "/tracks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authorizationHeaders()
                },
                body: JSON.stringify({
                    uris: fraction.map(song => song.uri).filter(uri => !!uri)
                })
            })
        )
    }

    return Promise.all(promises)
}

export async function searchSpotifyByISRC(isrc: string, albumName?: string): Promise<string | null> {
    console.log("Searching Spotify for ISRC", isrc)
    const response = await fetch(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track&limit=10&market=DE`, {
        // TODO: SET SCOPE user-read-private and then use "market=from_token"
        headers: authorizationHeaders()
    })
        .then(res => res.json())
        .catch(console.error)

    if (response && response.tracks && response.tracks.items && response.tracks.items.length > 0) {
        if (albumName) {
            const lowerAlbum = albumName.toLowerCase()
            const bestMatch = response.tracks.items.find((item: any) => item.album?.name?.toLowerCase() === lowerAlbum)
            if (bestMatch) return bestMatch.uri

            const partialMatch = response.tracks.items.find(
                (item: any) =>
                    item.album?.name?.toLowerCase().includes(lowerAlbum) || lowerAlbum.includes(item.album?.name?.toLowerCase())
            )
            if (partialMatch) return partialMatch.uri
        }
        return response.tracks.items[0].uri
    }

    return null
}

export async function searchSpotifyByMetadata(name: string, artist: string, albumName?: string): Promise<string | null> {
    const query = encodeURIComponent(`track:${name} artist:${artist}`)
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10&market=DE`, {
        headers: authorizationHeaders()
    })
        .then(res => res.json())
        .catch(console.error)

    if (response && response.tracks && response.tracks.items && response.tracks.items.length > 0) {
        if (albumName) {
            const lowerAlbum = albumName.toLowerCase()
            const bestMatch = response.tracks.items.find((item: any) => item.album?.name?.toLowerCase() === lowerAlbum)
            if (bestMatch) return bestMatch.uri

            const partialMatch = response.tracks.items.find(
                (item: any) =>
                    item.album?.name?.toLowerCase().includes(lowerAlbum) || lowerAlbum.includes(item.album?.name?.toLowerCase())
            )
            if (partialMatch) return partialMatch.uri
        }
        return response.tracks.items[0].uri
    }

    return null
}

function getRandomEmoji() {
    const emojis = ["🔮", "🎵", "🎶", "🎙", "🎤", "🎧", "📯", "🎼", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎹", "📻", "🎸"]
    return emojis[Math.floor(Math.random() * emojis.length)]
}
