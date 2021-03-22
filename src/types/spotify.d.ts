export interface PlaylistResponse {
    items: Playlist[]
    next?: string
}

export interface Playlist {
    id: string
    name: string
    tracks: {
        items: Song[]
        total: number
    }
    images: {
        url: string
    }[]
    owner: {
        id: string
    }
}

export interface Song {
    track: {
        name: string
        id: string
        uri: string
        external_ids: {
            isrc: string
        }
        duration_ms: number
        artists: Artist[]
        album: Album
    }
}

export interface Artist {
    name: string
}

export interface Album {
    images: {
        url: string
    }[]
}

export interface Profile {
    display_name: string
    id: string
}