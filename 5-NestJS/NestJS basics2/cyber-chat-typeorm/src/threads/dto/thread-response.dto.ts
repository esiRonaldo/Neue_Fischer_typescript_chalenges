import { Expose, Type } from "class-transformer";
import { CommentResponseDto } from "../../comments/dto/comment-response.dto.js";

export class ThreadResponseDto {
    @Expose()
    id: string

    @Expose()
    title: string

    @Expose()
    author: string

    @Expose()
    body: string

    @Expose()
    createdAt: Date

    @Expose()
    @Type(() => CommentResponseDto)
    comments?: CommentResponseDto[]

    @Expose()
    commentCount?: number
}