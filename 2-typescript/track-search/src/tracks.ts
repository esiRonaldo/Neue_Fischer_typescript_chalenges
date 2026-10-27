export interface Track {
    id: number;
    title: string;
    artist: string;
    liked: boolean;
}

export async function fetchTracks(url: string): Promise<Track[]> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Expected a list of tracks");
    }
    return data.filter(isTrack);
}

function isTrack(value: unknown): value is Track {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof value.id === "number" &&
        "title" in value &&
        typeof value.title === "string" &&
        "artist" in value &&
        typeof value.artist === "string" &&
        "liked" in value &&
        typeof value.liked === "boolean"
    );
}
