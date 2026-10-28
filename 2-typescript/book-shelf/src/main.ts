import type { Book } from './types.js'
import { groupBy, pluck, merge } from './utils.js'

const books: Book[] = [
    { id: 1, title: 'Dune', author: 'Frank Herbert', isbn: '978-0441013593', isAvailable: true, publisher: 'Ace', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Children of Dune', author: 'Frank Herbert', isbn: '978-0593098240', isAvailable: false, publisher: 'Ace', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0451524935', isAvailable: true, publisher: 'Signet', createdAt: new Date(), updatedAt: new Date() },
]

console.log(groupBy(books, 'author'))
console.log(pluck(books, 'title'))

const updated = merge(books[0], { title: 'Dune Messiah', isAvailable: false })
console.log(updated)
console.log(books[0])

interface User {
    name: string
    city: string
    age: number
}

const users: User[] = [
    { name: 'Ali', city: 'Berlin', age: 30 },
    { name: 'Sara', city: 'Hamburg', age: 25 },
    { name: 'Reza', city: 'Berlin', age: 40 },
]

console.log(groupBy(users, 'city'))
console.log(pluck(users, 'name'))
console.log(merge(users[0], { age: 31 }))
