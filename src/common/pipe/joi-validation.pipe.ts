import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, { abortEarly: true });
    if (error) {
      const errorMessage = error.details
        .map((detail) => `${detail.path.join('.')}: ${detail.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errorMessage}`);
    }
    return value;
  }
}
