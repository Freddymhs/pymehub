import {
  BadRequestException,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * Pipe global para validar payloads (body / query / params) con schemas Zod.
 * Uso: `@Body(new ZodValidationPipe(mySchema))` o registrar global con
 * `app.useGlobalPipes(new ZodValidationPipe())` (modo permissive — el controller
 * debe pasar el schema explícito por parámetro).
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema?: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    if (!this.schema) {
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new BadRequestException({
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      });
    }
    return result.data;
  }
}
