import { GenericSong } from "@/types/music"
import crypto from "crypto"

const LOCAL_STORAGE_PREFIX = "scp-"

export interface SongPickingProgress {
    index: number
    taken: number[]
}

function calculateChecksum(songs: GenericSong[]): string | null {
    const input = songs.map(song => song.id + song.provider.name).join(",")
    return crypto.createHash("md5").update(input).digest("hex")
}

export function saveProgress(songs: GenericSong[], progress: SongPickingProgress) {
    const key = LOCAL_STORAGE_PREFIX + calculateChecksum(songs)
    localStorage.setItem(key, JSON.stringify(progress))
}

export function readProgress(songs: GenericSong[]): SongPickingProgress | null {
    const key = LOCAL_STORAGE_PREFIX + calculateChecksum(songs)
    const item = localStorage.getItem(key)

    if (item) {
        try {
            const object = JSON.parse(item)
            if ("index" in object && "taken" in object) {
                return object as SongPickingProgress
            }
        } catch (e) {}
    }

    return null
}

export function deleteProgress(songs: GenericSong[]) {
    const key = LOCAL_STORAGE_PREFIX + calculateChecksum(songs)
    localStorage.removeItem(key)
}
