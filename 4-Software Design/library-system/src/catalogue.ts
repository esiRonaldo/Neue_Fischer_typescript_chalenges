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
// Pure: same row in, same response out, and it only builds a new object.
function toBookResponse(row: BookRow): BookResponse {
    return {
        id: row.id,
        title: row.title,
        authorName: row.author_name,
        addedAt: new Date(row.added_at * 1000).toISOString(),
    };
}

// Pure: filter and map return new arrays, the input array is not changed.
function getAvailableBooks(rows: BookRow[]): BookResponse[] {
    return rows
        .filter(row => row.is_available === 1)
        .map(toBookResponse)
}

// Pure: toSorted returns a sorted copy, so the caller's array keeps its order.
function sortNewestFirst(rows: BookRow[]): BookRow[] {
    return rows.toSorted((a, b) => b.added_at - a.added_at);
}

// GET /api/books in an Express app:
// - The model runs the SQL query (SELECT * FROM books) and returns BookRow[].
// - The controller sends the response with res.json(...).
// - The controller calls getAvailableBooks (and sortNewestFirst) between the two:
//   it gets the rows from the model, turns them into BookResponse[] with the
//   pure functions, and then sends the result.
// The SQL query and res.json are the side effects at the edges; the pure
// functions in the middle need no database and no request to test.
console.log(getAvailableBooks(sortNewestFirst(bookRows)))
