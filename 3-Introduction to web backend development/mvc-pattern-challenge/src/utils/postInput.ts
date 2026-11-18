import type { Request } from "express";
import sanitizeHtml from "sanitize-html";

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

export function readPostInput(body: Record<string, unknown>) {
    return {
        title: String(body.title ?? ""),
        author: String(body.author ?? ""),
        image: String(body.image ?? ""),
        teaser: String(body.teaser ?? ""),
        content: sanitizeHtml(String(body.content ?? ""), SANITIZE_OPTIONS),
    };
}

export function getSlugParam(req: Request): string {
    const slug = req.params.slug;
    return (Array.isArray(slug) ? slug[0] : slug) ?? "";
}
