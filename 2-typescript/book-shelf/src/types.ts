export type EntityId = number | string

export type Timestamped = {
    createdAt: Date
    updatedAt: Date
}

export type HasId = {
    id: EntityId
}

export type Book = HasId & Timestamped & {
    title: string
    author: string
    isbn: string
    isAvailable: boolean
    publisher: string

}

export type IsbnParts = [group: number, publisher: string, identifier: string]

export interface ApiResponse<T> {
    status: number
    message: string
    data: T
}

// const test: Book = {
//     id: 1,
//     createdAt: new Date,
//     updatedAt: new Date(),
//     title: "Dune",
//     author: "Frank richard",
//     isbn: "5558-512174",
//     isAvailable: true,
//     publisher:'Ehsan'
// };
// console.log('+')
// console.log(test)
// console.log('+')

export type BookCreatePayload = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
export type BookUpdatePayload = Partial<BookCreatePayload>
export type BookPreview = Pick<Book, 'id' | 'author' | 'title'>

export const create: BookCreatePayload = {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441013593",
    isAvailable: true,
    publisher: 'Mateo'
};

export const update: BookUpdatePayload = {
    publisher: "john",
};
console.log('/')
console.log(create)
console.log('***')
console.log(update)