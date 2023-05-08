import { authorizationHeaders } from "./authorization"
import { getProfile, getSavedSongs } from "./profile"
import { Image, Playlist, PlaylistCollection, Song, SongCollection } from "@typedefs/spotify"

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
    const response: SongCollection = await fetch(next ?? `https://api.spotify.com/v1/playlists/${id}/tracks`, {
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
            description: "🔥 Generated with the Spotify Composer by incxption. 👉 Create your own one at composer.goessl.me!"
        })
    })
        .then(res => res.json())
        .catch(console.error)
}

export async function addSongsToPlaylist(playlistId: string, songs: Song[]): Promise<any> {
    const copy = [...songs]
    const fractions: Song[][] = []
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
                    uris: fraction.map(song => song.track.uri)
                })
            })
        )
    }

    return Promise.all(promises)
}

function getRandomEmoji() {
    const emojis = ["🔮", "🎵", "🎶", "🎙", "🎤", "🎧", "📯", "🎼", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎹", "📻", "🎸"]
    return emojis[Math.floor(Math.random() * emojis.length)]
}
