import { findById } from "./api.js";
import type {
    LibraryTrack,
    TrackCreatePayload,
    TrackPreview,
    TrackUpdatePayload,
} from "./types.js";

const library: LibraryTrack[] = [];

export function addTrack(payload: TrackCreatePayload): LibraryTrack {
    const track: LibraryTrack = {
        ...payload,
        id: library.length + 1,
        addedAt: new Date(),
        playCount: 0,
    };
    library.push(track);
    return track;
}

export function updateTrack(
    id: number,
    changes: TrackUpdatePayload,
): LibraryTrack | undefined {
    const track = findById(library, id);
    if (track) {
        Object.assign(track, changes);
    }
    return track;
}

export function toPreview(track: LibraryTrack): TrackPreview {
    return { id: track.id, title: track.title, artist: track.artist };
}
