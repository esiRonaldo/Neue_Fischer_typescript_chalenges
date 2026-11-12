import type { Request, Response, NextFunction } from "express";

function deny(res: Response): void {
    res.set("WWW-Authenticate", 'Basic realm="Admin", charset="UTF-8"');
    res.status(401).send("Authentication required");
}

export function basicAuth(req: Request, res: Response, next: NextFunction): void {
    const expectedUser = process.env.ADMIN_USER;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPassword) {
        res.status(500).send("Admin credentials are not configured");
        return;
    }

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Basic ")) {
        deny(res);
        return;
    }

    const encoded = header.slice("Basic ".length);
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
        deny(res);
        return;
    }

    const user = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (user !== expectedUser || password !== expectedPassword) {
        deny(res);
        return;
    }

    next();
}
