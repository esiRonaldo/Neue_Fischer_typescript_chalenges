type BookRow = {
    id: number;
    title: string;
    author_name: string;
    is_available: 0 | 1;
    added_at: number;
};

const bookRows: BookRow[] = [
    {
        id: 1,
        title: "Dune",
        author_name: "Frank Herbert",
        is_available: 1,
        added_at: 1730937600,
    },
    {
        id: 2,
        title: "Piranesi",
        author_name: "Susanna Clarke",
        is_available: 1,
        added_at: 1731196800,
    },
    {
        id: 3,
        title: "Kindred",
        author_name: "Octavia E. Butler",
        is_available: 0,
        added_at: 1731024000,
    },
    {
        id: 4,
        title: "Neuromancer",
        author_name: "William Gibson",
        is_available: 0,
        added_at: 1731283200,
    },
    {
        id: 5,
        title: "The Left Hand of Darkness",
        author_name: "Ursula K. Le Guin",
        is_available: 1,
        added_at: 1731110400,
    },
];
type BookResponse = {
    id: number
    title: string
    authorName: string
    addedAt: string
}
//TODO: all pure why?
//MVC Model calls ...?
function toBookResponse(row: BookRow): BookResponse {
    return {
        id: row.id,
        title: row.title,
        authorName: row.author_name,
        addedAt: new Date(row.added_at * 1000).toISOString(),
    };
}

function getAvailableBooks(rows: BookRow[]): BookResponse[] {
    return rows
        .filter(row => row.is_available === 1)
        .map(toBookResponse)
}

function sortNewestFirst(rows: BookRow[]): BookRow[] {
    return rows.toSorted((a, b) => b.added_at - a.added_at);
}
console.log(getAvailableBooks(sortNewestFirst(bookRows)))
