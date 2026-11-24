import { Expose } from "class-transformer";

export class CommentResponseDto {
    @Expose()
    id: string

    @Expose()
    threadId: string

    @Expose()
    author: string

    @Expose()
    body: string

    @Expose()
    createdAt: Date
}