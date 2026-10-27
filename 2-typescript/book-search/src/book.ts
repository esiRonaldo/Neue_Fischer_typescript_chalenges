export interface Book {
    id: string
    title: string
    subtitle: string
    authors: string
    image: string
    url: string
}

export interface SearchResult {
    status: string
    total: string
    books: Book[]
}

function isBook(value: unknown): value is Book {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof value.id === "string" &&
        "title" in value &&
        typeof value.title === "string" &&
        "subtitle" in value &&
        typeof value.subtitle === "string" &&
        "authors" in value &&
        typeof value.authors === "string" &&
        "image" in value &&
        typeof value.image === "string" &&
        "url" in value &&
        typeof value.url === "string"
    );
}

function isSearchResult(value: unknown): value is SearchResult {
    return (
        typeof value === "object" &&
        value !== null &&
        "status" in value &&
        typeof value.status === "string" &&
        "total" in value &&
        typeof value.total === "string" &&
        "books" in value &&
        Array.isArray(value.books) &&
        value.books.every(isBook)
    );
}

export async function fetchBooks(query: string): Promise<Book[]> {
    const response = await fetch(`https://www.dbooks.org/api/search/${encodeURIComponent(query)}`,
    )
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const data: unknown = await response.json()
    if (!isSearchResult(data))
        throw new Error(`Unexpected response from the book API`);

    return data.books
}