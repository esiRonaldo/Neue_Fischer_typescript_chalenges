import type { Request, Response } from "express";
import * as postModel from "../models/postModel";
import { readPostInput, getSlugParam } from "../utils/postInput";

async function renderPostForm(
    res: Response,
    status: number,
    data: { post: object; action: string; error?: string },
) {
    const authors = await postModel.getAllAuthors();
    res.status(status).render("admin/adminForm.html", { ...data, authors });
}

export async function listAdminPosts(_req: Request, res: Response) {
    const posts = (await postModel.getAllPosts()).map((post) => ({
        ...post,
        slug: postModel.slugify(post.title),
    }));

    res.render("admin/admin.html", { posts });
}

export async function showNewPostForm(_req: Request, res: Response) {
    await renderPostForm(res, 200, { post: {}, action: "/admin/posts" });
}

export async function createPost(req: Request, res: Response) {
    const post = readPostInput(req.body);
    if (!(await postModel.authorExists(post.author))) {
        await renderPostForm(res, 400, {
            post,
            action: "/admin/posts",
            error: "Please choose an author",
        });
        return;
    }

    const existing = await postModel.getPostBySlug(postModel.slugify(post.title));
    if (existing) {
        await renderPostForm(res, 409, {
            post,
            action: "/admin/posts",
            error: "A post with this title already exists",
        });
        return;
    }

    await postModel.addPost(post);
    res.redirect("/admin");
}

export async function showEditPostForm(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const post = await postModel.getPostBySlug(slug);
    if (!post) {
        res.status(404).send("Post not found");
        return;
    }

    await renderPostForm(res, 200, { post, action: `/admin/posts/${slug}` });
}

export async function saveEditedPost(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const changes = readPostInput(req.body);
    if (!(await postModel.authorExists(changes.author))) {
        await renderPostForm(res, 400, {
            post: changes,
            action: `/admin/posts/${slug}`,
            error: "Please choose an author",
        });
        return;
    }

    const newSlug = postModel.slugify(changes.title);
    if (newSlug !== slug && (await postModel.getPostBySlug(newSlug))) {
        await renderPostForm(res, 409, {
            post: changes,
            action: `/admin/posts/${slug}`,
            error: "A post with this title already exists",
        });
        return;
    }

    const found = await postModel.updatePost(slug, changes);
    if (!found) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
}

export async function removePost(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const found = await postModel.deletePost(slug);
    if (!found) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
}
