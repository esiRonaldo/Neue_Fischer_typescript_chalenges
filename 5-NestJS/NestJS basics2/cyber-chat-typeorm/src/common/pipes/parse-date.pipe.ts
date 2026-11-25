import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseDatePipe implements PipeTransform<string | undefined, Date | undefined> {

    transform(value: string | undefined): Date | undefined {
        if (value === undefined) return value
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) {
            throw new BadRequestException(`"${value}" is not a valid date.`)
        }
        return date
    }
}