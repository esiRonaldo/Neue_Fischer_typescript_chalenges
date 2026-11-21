import { Injectable } from "@nestjs/common";
import type { Comment, CommentPayload } from "./comment.js";
import { randomUUID } from "node:crypto";

@Injectable()
export class CommentsRepository {
    private readonly comments = new Map<string, Comment>()

    findById(id: string): Comment | undefined {
        return this.comments.get(id)
    }

    findByThread(threadId: string): Comment[] {
        return [...this.comments.values()].filter(comment => comment.threadId === threadId)
    }

    create(threadId: string, payload: CommentPayload): Comment {
        const comment: Comment = {
            id: randomUUID(),
            threadId,
            ...payload,
            createdAt: new Date()
        }
        this.comments.set(comment.id, comment)
        return comment
    }



}