
import type {
    EntityId,
    Book,
    BookPreview,
    BookCreatePayload,
    BookUpdatePayload,
    ApiResponse,
    IsbnParts,
} from './types.js'

// Mock database
const books: Book[] = []
let nextId = 1

// 1. Fetch all books
export const fetchBooks = async (): Promise<ApiResponse<BookPreview[]>> => {
    const previews: BookPreview[] = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
    }))

    return {
        status: 200,
        message: 'Books fetched successfully',
        data: previews,
    }
}

// 2. Fetch a book by ID
export const fetchBook = async (
    id: EntityId
): Promise<ApiResponse<Book>> => {
    const book = books.find((book) => book.id === id)

    if (!book) {
        throw new Error('Book not found')
    }

    return {
        status: 200,
        message: 'Book fetched successfully',
        data: book,
    }
}

// 3. Create a new book
export const createBook = async (
    payload: BookCreatePayload
): Promise<ApiResponse<Book>> => {
    const now = new Date()

    const newBook: Book = {
        ...payload,
        id: nextId++,
        createdAt: now,
        updatedAt: now,
    }

    books.push(newBook)

    return {
        status: 201,
        message: 'Book created successfully',
        data: newBook,
    }
}

// 4. Update an existing book
export const updateBook = async (
    id: EntityId,
    changes: BookUpdatePayload
): Promise<ApiResponse<Book>> => {
    const book = books.find((book) => book.id === id)

    if (!book) {
        throw new Error('Book not found')
    }

    Object.assign(book, changes, {
        updatedAt: new Date(),
    })

    return {
        status: 200,
        message: 'Book updated successfully',
        data: book,
    }
}

// 5. Parse ISBN
export const parseIsbn = (isbn: string): IsbnParts => {
    const parts = isbn.split('-')

    if (parts.length < 3) {
        throw new Error('ISBN must contain at least three parts')
    }

    const [group, publisher, ...identifier] = parts

    return [
        Number(group),
        publisher,
        identifier.join('-'),
    ]
}
