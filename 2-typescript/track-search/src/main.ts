import { fetchTracks } from "./tracks.js";
import type { Track } from "./tracks.js";

const form = document.getElementById("search-form");
const list = document.getElementById("track-list");

if (!(form instanceof HTMLFormElement)) {
    throw new Error("Element #search-form not found");
}
if (!(list instanceof HTMLUListElement)) {
    throw new Error("Element #track-list not found");
}

function readQuery(form: HTMLFormElement): string {
    const query = new FormData(form).get("query");
    return typeof query === "string" ? query.trim().toLowerCase() : "";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(readQuery(form));
    const query = readQuery(form);
    render(
        tracks.filter((track) =>
            `${track.title} ${track.artist}`.toLowerCase().includes(query),
        ),
    );
});

const render = (results: Track[]): void => {
    list.replaceChildren(
        ...results.map((track) => {
            const item = document.createElement("li");
            const button = document.createElement("button");
            button.dataset.id = String(track.id);
            button.textContent = track.liked ? "♥" : "♡";
            item.append(button, ` ${track.title} by ${track.artist}`);
            return item;
        }),
    );
};

let tracks: Track[] = [];
try {
    tracks = await fetchTracks("tracks.json");
    render(tracks);
} catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    list.textContent = `Could not load tracks: ${message}`;
}

list.addEventListener("click", (event) => {
    const button = event.target;
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }

    const id = Number(button.dataset.id);
    const track = tracks.find((item) => item.id === id);
    if (track) {
        track.liked = !track.liked;
        button.textContent = track.liked ? "♥" : "♡";
    }
});
