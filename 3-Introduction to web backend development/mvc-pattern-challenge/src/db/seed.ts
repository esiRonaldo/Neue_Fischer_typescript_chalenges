import { getDB } from "./database";
import { seedPosts, slugify } from "../models/postModel";

export async function seedDB(): Promise<void> {
    if (process.env.NODE_ENV !== "development") return;

    const db = getDB();
    const row = await db.get<{ count: number }>(
        "SELECT COUNT(*) AS count FROM posts",
    );
    if (row && row.count > 0) return;

    for (const post of seedPosts) {
        await db.run(
            `INSERT INTO posts (slug, title, image, author, createdAt, teaser, content)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            slugify(post.title),
            post.title,
            post.image,
            post.author,
            post.createdAt,
            post.teaser,
            post.content,
        );
    }

    console.log(`Seeded ${seedPosts.length} posts`);
}
