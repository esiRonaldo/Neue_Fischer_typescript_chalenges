import { Transform } from 'class-transformer';

// LEARN: @IsNotEmpty() only rejects "", so "   " passes as a title.
// @Trim() removes the spaces before validation runs (ValidationPipe first
// turns the body into the DTO class, then validates it). "   " becomes "",
// and @IsNotEmpty() rejects it. "  Hello " is saved as "Hello".
// Anything that is not a string stays as it is, so @IsString() still fails.
export function Trim(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}
