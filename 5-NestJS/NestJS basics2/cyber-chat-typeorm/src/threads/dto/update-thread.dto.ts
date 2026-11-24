import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateThreadDto } from './create-thread.dto.js';

export class UpdateThreadDto extends PartialType(
    PickType(CreateThreadDto, ['title', 'body']),
    { skipNullProperties: false },
) { }