import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateThreadDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    title: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    author: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    body: string
}