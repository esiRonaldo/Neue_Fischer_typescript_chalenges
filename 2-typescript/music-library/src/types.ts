export interface Media {
    id: number;
    title: string;
}

export interface Track extends Media {
    artist: string;
    liked: boolean;
}

export interface FeaturedTrack extends Track {
    curatedBy: string;
    readonly addedDate: string;
}
