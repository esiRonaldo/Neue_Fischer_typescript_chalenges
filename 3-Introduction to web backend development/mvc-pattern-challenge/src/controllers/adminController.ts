import type { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import * as postModel from "../models/postModel";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: [
        "p", "br", "strong", "em", "blockquote",
        "h2", "h3", "h4",
        "a",
        "ul", "ol", "li",
        "img",
    ],
    allowedAttributes: {
        a: ["href", "title"],
        img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
};

function readPostForm(body: Record<string, unknown>) {
    return {
        title: String(body.title ?? ""),
        author: String(body.author ?? ""),
        image: String(body.image ?? ""),
        teaser: String(body.teaser ?? ""),
        content: sanitizeHtml(String(body.content ?? ""), SANITIZE_OPTIONS),
    };
}

function getSlugParam(req: Request): string {
    const slug = req.params.slug;
    return (Array.isArray(slug) ? slug[0] : slug) ?? "";
}

export async function listAdminPosts(_req: Request, res: Response) {
    const posts = (await postModel.getAllPosts()).map((post) => ({
        ...post,
        slug: postModel.slugify(post.title),
    }));

    res.render("admin.html", { posts });
}

export function showNewPostForm(_req: Request, res: Response) {
    res.render("adminForm.html", { post: {}, action: "/admin/posts" });
}

export function createPost(req: Request, res: Response) {
    postModel.addPost({
        ...readPostForm(req.body),
        createdAt: Math.floor(Date.now() / 1000),
    });

    res.redirect("/admin");
}

export async function showEditPostForm(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const post = await postModel.getPostBySlug(slug);
    if (!post) {
        res.status(404).send("Post not found");
        return;
    }

    res.render("adminForm.html", { post, action: `/admin/posts/${slug}` });
}

export function saveEditedPost(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const found = postModel.updatePost(slug, readPostForm(req.body));
    if (!found) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
}

export function removePost(req: Request, res: Response) {
    const slug = getSlugParam(req);
    const found = postModel.deletePost(slug);
    if (!found) {
        res.status(404).send("Post not found");
        return;
    }

    res.redirect("/admin");
}
