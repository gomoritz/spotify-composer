import { Playlist as SpotifyPlaylist, Song as SpotifySong } from "./spotify"

export interface MusicProvider {
    name: "spotify" | "apple-music"
    id: string
}

export interface GenericSong {
    id: string
    name: string
    artist: string
    album: string
    artworkUrl?: string
    isrc?: string
    previewUrl?: string
    popularity?: number
    durationMs?: number
    uri?: string // Specifically for Spotify
    provider: MusicProvider
}

export interface GenericPlaylist {
    id: string
    name: string
    description?: string
    artworkUrl?: string
    trackCount?: number
    provider: MusicProvider
}

export function mapSpotifyPlaylist(p: SpotifyPlaylist): GenericPlaylist {
    return {
        id: p.id,
        name: p.name,
        artworkUrl: p.images && p.images.length > 0 ? p.images[0].url : undefined,
        trackCount: p.tracks?.total,
        provider: { name: "spotify", id: "spotify" }
    }
}

export function mapSpotifySong(s: SpotifySong): GenericSong {
    return {
        id: s.track.id,
        name: s.track.name,
        artist: s.track.artists[0]?.name || "Unknown Artist",
        album: s.track.album.name,
        artworkUrl:
            s.track.album.images && s.track.album.images.length > 0 ? s.track.album.images[0]?.url || undefined : undefined,
        isrc: s.track.external_ids.isrc,
        previewUrl: s.track.preview_url || undefined,
        popularity: s.track.popularity,
        durationMs: s.track.duration_ms,
        uri: s.track.uri,
        provider: { name: "spotify", id: "spotify" }
    }
}

export function mapAppleMusicPlaylist(p: any): GenericPlaylist {
    const attributes = p.attributes || {}
    const relationships = p.relationships || {}

    return {
        id: p.id,
        name: attributes.name,
        description: attributes.description?.standard,
        artworkUrl: attributes.artwork?.url?.replace("{w}", "300").replace("{h}", "300"),
        trackCount:
            attributes.trackCount ??
            attributes["track-count"] ??
            relationships.tracks?.meta?.total ??
            relationships.tracks?.data?.length,
        provider: { name: "apple-music", id: "apple-music" }
    }
}

export function mapAppleMusicSong(s: any): GenericSong {
    const attributes = s.attributes || {}
    const catalogData = s.relationships?.catalog?.data?.[0]?.attributes || {}

    return {
        id: s.id,
        name: attributes.name,
        artist: attributes.artistName,
        album: attributes.albumName,
        artworkUrl: attributes.artwork?.url?.replace("{w}", "300").replace("{h}", "300"),
        isrc: attributes.isrc || catalogData.isrc,
        previewUrl: attributes.previews?.[0]?.url || catalogData.previews?.[0]?.url,
        durationMs: attributes.durationInMillis,
        provider: { name: "apple-music", id: "apple-music" }
    }
}
