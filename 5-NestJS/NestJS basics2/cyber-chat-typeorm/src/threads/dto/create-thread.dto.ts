import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator.js';

// LEARN: UpdateThreadDto copies these rules (PickType + PartialType),
// @Trim() included, so PATCH trims title and body as well.
export class CreateThreadDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  author: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  body: string;
}
