import { fetchBooks, type Book } from "./book.js";

const form = document.getElementById("search-form");
const list = document.getElementById("book-list");

if (!(form instanceof HTMLFormElement)) {
    throw new Error("Element #search-form not found");
}
if (!(list instanceof HTMLUListElement)) {
    throw new Error("Element #book-list not found");
}

function readQuery(form: HTMLFormElement): string {
    const query = new FormData(form).get("query");
    return typeof query === "string" ? query.trim() : "";
}

const render = (books: Book[]): void => {
    list.replaceChildren(
        ...books.map(book => {
            const item = document.createElement('li')
            item.textContent = `${book.title} by ${book.authors}`
            return item
        })
    )

}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = readQuery(form);
    if (!query) {
        return;
    }
    try {
        const books = await fetchBooks(query);
        render(books);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        list.textContent = `Could not load books: &{message}`
    }
});