export interface PlaylistCollection {
    items: Playlist[]
    next?: string
}

export interface SongCollection {
    items: Song[]
    next?: string
}

export interface Playlist {
    id: string
    name: string
    tracks: {
        items: Song[]
        total: number
    }
    images: Image[]
    owner: {
        id: string
    }
}

export interface Song {
    is_local: boolean
    track: {
        name: string
        id: string
        uri: string
        is_local: boolean
        track?: boolean
        external_ids: {
            isrc?: string
        }
        duration_ms: number
        artists: Artist[]
        album: Album
        preview_url?: string
    }
}

export interface Artist {
    name: string
}

export interface Album {
    images: (Image | null)[]
    id: string
}

interface Image {
    width?: number
    height?: number
    url: string
}

export interface Profile {
    display_name: string
    id: string
    images: Image[]
}
