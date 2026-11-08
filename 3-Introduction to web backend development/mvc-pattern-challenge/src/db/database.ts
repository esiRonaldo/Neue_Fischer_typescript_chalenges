import path from "path"
import { open, Database } from "sqlite"
import sqlite3 from "sqlite3"


const DB_FILE = path.join(process.cwd(), process.env.DB_FILE ?? 'src/db/blog.db')
let db: Database | null = null

export async function connectDB(): Promise<Database> {
    db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database
    })
    await db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    author TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    teaser TEXT NOT NULL,
    content TEXT NOT NULL
  )
`)
    console.log("Connected to SQLite database");

    return db

}

export function getDB(): Database {
    if (!db) {
        throw new Error('Database not connected. Call connectDb()')
    }
    return db
}

export async function closeDB(): Promise<void> {
    if (db) {
        await db.close()
        db = null
    }
}