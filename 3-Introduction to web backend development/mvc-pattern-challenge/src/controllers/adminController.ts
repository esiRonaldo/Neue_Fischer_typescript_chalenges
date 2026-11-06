import type { Request, Response } from "express";
import * as postModel from "../models/postModel";

function readPostForm(body: Record<string, unknown>) {
    return {
        title: String(body.title ?? ""),
        author: String(body.author ?? ""),
        image: String(body.image ?? ""),
        teaser: String(body.teaser ?? ""),
        content: String(body.content ?? ""),
    };
}

function getSlugParam(req: Request): string {
    const slug = req.params.slug;
    return (Array.isArray(slug) ? slug[0] : slug) ?? "";
}

export const listAdminPosts = (_req: Request, res: Response) => {
    const posts = postModel.getAllPosts().map((post) => ({
        ...post,
        slug: postModel.slugify(post.title),
    }));

    res.render("admin.html", { posts });
};

export const showNewPostForm = (_req: Request, res: Response) => {
    res.render("adminForm.html", { post: {}, action: "/admin/posts" });
};

export const createPost = (req: Request, res: Response) => {
    postModel.addPost({
        ...readPostForm(req.body),
        createdAt: Math.floor(Date.now() / 1000),
    });

    res.redirect("/admin");
};

export const showEditPostForm = (req: Request, res: Response) => {
    const slug = getSlugParam(req);
    const post = postModel.getPostBySlug(slug);
    if (!post) {
        res.status(404).send("Post not found");
        return;
    }

    res.render("adminForm.html", { post, action: `/admin/posts/${slug}` });
};

export const saveEditedPost = (req: Request, res: Response) => {
    const slug = getSlugParam(req);
    const found = postModel.updatePost(slug, readPostForm(req.body));
    if (!found) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
};

export const removePost = (req: Request, res: Response) => {
    const slug = getSlugParam(req);
    const found = postModel.deletePost(slug);
    if (!found) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
};
