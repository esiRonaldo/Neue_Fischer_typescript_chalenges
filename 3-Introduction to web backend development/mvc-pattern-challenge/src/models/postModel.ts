import { getDB } from "../db/database";

export interface Post {
    title: string;
    image: string;
    author: string;
    createdAt: number;
    teaser: string;
    content: string;
}

export const seedPosts: Post[] = [
    {
        title: "Black: The Absence, Not the Presence, of Color",
        image: "colorful-umbrella.jpg",
        author: "Peter Parker",
        createdAt: 1743120000,
        teaser:
            "Scientifically, black is not a color but rather the absence of all colors, occurring when an object absorbs nearly all light wavelengths instead of reflecting them.",
        content:
            "<p>When you think about the rainbow, you see a vibrant spectrum of hues. But black does not appear in that spectrum the same way red or blue does.</p><p>From a scientific perspective, black is usually the absence of visible light, not a reflected wavelength.</p>",
    },
    {
        title: "Flowers: Nature's Muse for Design",
        image: "flowers.jpg",
        author: "Peter Parker",
        createdAt: 1745452800,
        teaser:
            "Flowers inspire design with their color palettes, structure, and balance between repetition and variation.",
        content:
            "<p>Designers borrow from flowers all the time: layered composition, contrasting accents, and natural hierarchy.</p>",
    },
    {
        title: "UDesign's Harmony: Core Purpose and Supporting Details",
        image: "sailing.jpg",
        author: "Peter Parker",
        createdAt: 1748736000,
        teaser:
            "Strong design starts with one clear core idea, then adds supporting details that reinforce it.",
        content:
            "<p>A useful mental model is major and minor elements. Major elements communicate the main point, minor elements support it without stealing focus.</p>",
    },
];

let posts: Post[] = [...seedPosts];

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

export function writePosts(newPosts: Post[]): void {
    posts = newPosts;
}

export function addPost(post: Post): void {
    writePosts([...posts, post]);
}

export function updatePost(slug: string, changes: Partial<Post>): boolean {
    const index = posts.findIndex((post) => slugify(post.title) === slug);
    if (index === -1) {
        return false;
    }

    const updated = [...posts];
    updated[index] = { ...posts[index]!, ...changes };
    writePosts(updated);
    return true;
}

export function deletePost(slug: string): boolean {
    const remaining = posts.filter((post) => slugify(post.title) !== slug);
    if (remaining.length === posts.length) {
        return false;
    }

    writePosts(remaining);
    return true;
}
