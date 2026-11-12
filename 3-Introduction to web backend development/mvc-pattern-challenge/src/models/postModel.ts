import { getDB } from "../db/database";

export interface Post {
    title: string;
    image: string;
    author: string;
    createdAt: number;
    teaser: string;
    content: string;
}

export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function getAllPosts(): Promise<Post[]> {
    const db = getDB();
    return db.all<Post[]>(
        "SELECT title, image, author, createdAt, teaser, content FROM posts",
    );
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const db = getDB();
    return db.get<Post>(
        "SELECT title, image, author, createdAt, teaser, content FROM posts WHERE slug = ?",
        slug,
    );
}

export async function addPost(post: Omit<Post, "createdAt">): Promise<void> {
    const db = getDB();
    await db.run(
        `INSERT INTO posts (slug, title, image, author, createdAt, teaser, content)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        slugify(post.title),
        post.title,
        post.image,
        post.author,
        Math.floor(Date.now() / 1000),
        post.teaser,
        post.content,
    );
}

export async function updatePost(
    slug: string,
    changes: Omit<Post, "createdAt">,
): Promise<boolean> {
    const db = getDB();
    const result = await db.run(
        `UPDATE posts
         SET slug = ?, title = ?, image = ?, author = ?, teaser = ?, content = ?
         WHERE slug = ?`,
        slugify(changes.title),
        changes.title,
        changes.image,
        changes.author,
        changes.teaser,
        changes.content,
        slug,
    );
    return (result.changes ?? 0) > 0;
}

export async function deletePost(slug: string): Promise<boolean> {
    const db = getDB();
    const result = await db.run("DELETE FROM posts WHERE slug = ?", slug);
    return (result.changes ?? 0) > 0;
}
