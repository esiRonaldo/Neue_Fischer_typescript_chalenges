export interface Watchable {
    readonly id: number;
    title: string;
    year: number;
}

export interface Film extends Watchable {
    watched: boolean;
    rating?: 1 | 2 | 3 | 4 | 5;
}

export interface Playlist {
    name: string;
    films: Film[];
}

export const formatFilm = (film: Film): string => {
    const status = film.watched ? "watched" : "not watched";
    const rating = film.rating ? ` – ${film.rating}/5` : "";
    return `${film.title} (${film.year}) – ${status}${rating}`;
};

export const getUnwatched = (playlist: Playlist): Film[] => {
    return playlist.films.filter((film) => !film.watched);
};