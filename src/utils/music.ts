import { GenericPlaylist, GenericSong, mapSpotifySong } from "@/types/music"
import { getPlaylistTracks as getSpotifyPlaylistTracks } from "@/spotify/playlists"
import { getAppleMusicPlaylistTracks } from "@/apple/music"
import { getSavedSongs as getSpotifySavedSongs } from "@/spotify/profile"

export interface SongLoadingState {
    songs: number
    playlist: GenericPlaylist
}

export async function collectSongs(
    playlists: GenericPlaylist[],
    loadingCallback: (state: SongLoadingState) => void
): Promise<GenericSong[]> {
    const result: GenericSong[] = []
    const isAlreadyAdded = (song: GenericSong) =>
        !!result.find(
            it =>
                (it.isrc && song.isrc && it.isrc === song.isrc) || (it.id === song.id && it.provider.name === song.provider.name)
        )

    for (let playlist of playlists) {
        let songs: GenericSong[] = []

        if (playlist.provider.name === "spotify") {
            const spotifySongs =
                playlist.id === "library-pseudo" ? await getSpotifySavedSongs() : await getSpotifyPlaylistTracks(playlist.id)
            songs = spotifySongs.filter(s => s.track && !s.is_local && !s.track.is_local).map(mapSpotifySong)
        } else if (playlist.provider.name === "apple-music") {
            songs = await getAppleMusicPlaylistTracks(playlist.id)
        }

        for (let song of songs) {
            if (isAlreadyAdded(song)) continue
            result.push(song)
        }

        loadingCallback({ songs: result.length, playlist })
    }
    return result
}
