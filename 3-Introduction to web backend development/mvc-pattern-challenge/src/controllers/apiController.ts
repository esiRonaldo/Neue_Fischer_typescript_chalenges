import type { Request, Response } from "express";
import * as postModel from "../models/postModel";
import { readPostInput, getSlugParam } from "../utils/postInput";

function findMissingField(post: { title: string; content: string }): string | undefined {
    if (!post.title.trim()) return "title";
    if (!post.content.trim()) return "content";
    return undefined;
}

export async function createPostApi(req: Request, res: Response) {
    const post = readPostInput(req.body ?? {});
    const missing = findMissingField(post);
    if (missing) {
        res.status(400).json({ error: `Missing required field: ${missing}` });
        return;
    }

    const slug = postModel.slugify(post.title);
    if (await postModel.getPostBySlug(slug)) {
        res.status(409).json({ error: "A post with this title already exists" });
        return;
    }

    await postModel.addPost(post);
    res.status(201).json({ slug });
}

export async function replacePostApi(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const post = readPostInput(req.body ?? {});
    const missing = findMissingField(post);
    if (missing) {
        res.status(400).json({ error: `Missing required field: ${missing}` });
        return;
    }

    if (!(await postModel.getPostBySlug(slug))) {
        res.status(404).json({ error: "Post not found" });
        return;
    }

    const newSlug = postModel.slugify(post.title);
    if (newSlug !== slug && (await postModel.getPostBySlug(newSlug))) {
        res.status(409).json({ error: "A post with this title already exists" });
        return;
    }

    await postModel.updatePost(slug, post);
    res.status(200).json({ slug: newSlug });
}

export async function deletePostApi(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const found = await postModel.deletePost(slug);
    if (!found) {
        res.status(404).json({ error: "Post not found" });
        return;
    }

    res.status(204).end();
}
