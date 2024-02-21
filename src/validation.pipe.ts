import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log({ value, metadata });
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log(errors);
      const message = errors.map((error) => {
        return Object.values(error.constraints).join(', ');
      }).join('; ');
      throw new BadRequestException(message);
    }
    return value;
  }
}