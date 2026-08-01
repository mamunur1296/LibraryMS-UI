import { z } from 'zod';

export const AuthorDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CategoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const BookDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  isbn: z.string(),
  description: z.string(),
  publicationYear: z.number(),
  language: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  authorId: z.string(),
  authorName: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  totalCopies: z.number(),
  availableCopies: z.number(),
});

export function getPagedResultSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    totalCount: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  });
}

export const PagedBookResultSchema = getPagedResultSchema(BookDtoSchema);
