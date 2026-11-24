import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator.js';

export class CreateCommentDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  author: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string;
}
