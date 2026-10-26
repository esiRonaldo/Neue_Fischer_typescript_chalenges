import { readFileSync } from "node:fs";
import { formatId, describeFormat } from "./track.js";
import type { Track, FeaturedTrack, Format } from "./types.js";
// import { findById, ok } from "./api.js";
import { addTrack, updateTrack, toPreview } from "./library.js";

const libraryName = "Late Night Listening";

function describeTrack(title: string, artist: string): string {
    return `${title} by ${artist}`;
}

const tracks: Track[] = [
    { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
    { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

const pick: FeaturedTrack = {
    id: 3,
    title: "Golden",
    artist: "Jill Scott",
    liked: true,
    curatedBy: "editorial",
    addedDate: "2024-01-15",
};

console.log(`Library: ${libraryName}`);
console.log(describeTrack(tracks[0].title, tracks[0].artist));
tracks.forEach((t) => console.log(formatId(t.id)));
console.log(`Featured: ${pick.title}, added ${pick.addedDate}`);


const notes = readFileSync("notes.txt", "utf8");
console.log(notes);
console.log(describeFormat("vinyl"));

const columns: (keyof Track)[] = ["title", "artist", "liked"];

for (const track of tracks) {
    console.log(columns.map((column) => track[column]).join(" | "));
}

const ivy = addTrack({ title: "Ivy", artist: "Frank Ocean", liked: false });
updateTrack(ivy.id, { liked: true });

console.log(toPreview(ivy), ivy.liked);
const formatCounts: Record<Format, number> = {
  vinyl: 12,
  cd: 30,
  digital: 214,
};

console.log(formatCounts);
