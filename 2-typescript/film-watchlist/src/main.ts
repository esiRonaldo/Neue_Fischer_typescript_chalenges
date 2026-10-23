import { formatFilm, getUnwatched } from "./types.js";
import type { Playlist } from "./types.js";

const samplePlaylist: Playlist = {
    name: 'favorite movies',
    films: [
        { id: 1, title: 'matrix', year: 1999, watched: true, rating: 4 },
        { id: 2, title: 'titanic', year: 1997, watched: true, rating: 3 },
        { id: 3, title: 'gladiator', year: 2000, watched: true, rating: 5 },
        { id: 4, title: 'matrix4', year: 2024, watched: false },
    ]
}
console.log("All films:");
for (const film of samplePlaylist.films) {
    console.log(formatFilm(film));
}

console.log("\nUnwatched:");
for (const film of getUnwatched(samplePlaylist)) {
    console.log(formatFilm(film));
}