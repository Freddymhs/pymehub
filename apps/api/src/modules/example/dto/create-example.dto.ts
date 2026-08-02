import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export type CreateExampleDto = z.infer<typeof createExampleSchema>;
