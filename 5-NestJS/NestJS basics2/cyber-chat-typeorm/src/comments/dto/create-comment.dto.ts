import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    author: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    body: string;
}