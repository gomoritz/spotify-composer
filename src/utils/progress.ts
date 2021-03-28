import { Song } from "@typedefs/spotify"
import crypto from "crypto"

const LOCAL_STORAGE_PREFIX = "scp-"

export interface SongPickingProgress {
    index: number
    taken: number[]
}

function calculateChecksum(songs: Song[]): string | null {
    const input = songs.map(song => song.track.id).join(",")
    return crypto.createHash("md5").update(input).digest("hex")
}

export function saveProgress(songs: Song[], progress: SongPickingProgress) {
    const key = LOCAL_STORAGE_PREFIX + calculateChecksum(songs)
    localStorage.setItem(key, JSON.stringify(progress))
}

export function readProgress(songs: Song[]): SongPickingProgress | null {
    const key = LOCAL_STORAGE_PREFIX + calculateChecksum(songs)
    const item = localStorage.getItem(key)

    if (item) {
        try {
            const object = JSON.parse(item)
            if ("index" in object  && "taken" in object) {
                return object as SongPickingProgress
            }
        } catch (e) {
        }
    }

    return null
}

export function deleteProgress(songs: Song[]) {
    const key = LOCAL_STORAGE_PREFIX + calculateChecksum(songs)
    localStorage.removeItem(key)
}