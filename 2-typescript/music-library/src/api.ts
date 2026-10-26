import type { ApiResponse } from "./types.js";

export function ok<T>(data: T): ApiResponse<T> {
    return { status: 200, message: "OK", data };
}

export function findById<T extends { id: number }>(
    items: T[],
    id: number,
): T | undefined {
    return items.find((item) => item.id === id);
}
