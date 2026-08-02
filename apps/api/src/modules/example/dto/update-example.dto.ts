import { z } from 'zod';
import { createExampleSchema } from './create-example.dto.js';

export const updateExampleSchema = createExampleSchema.partial();

export type UpdateExampleDto = z.infer<typeof updateExampleSchema>;
