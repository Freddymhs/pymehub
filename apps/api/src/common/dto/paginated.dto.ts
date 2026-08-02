import { z } from 'zod';

export const paginationQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).default(20),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;

export interface PaginatedMeta {
  timestamp: string;
  path: string;
  total: number;
  offset: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  data: T[];
  meta: PaginatedMeta;
}
