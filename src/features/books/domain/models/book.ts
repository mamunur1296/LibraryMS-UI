export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Author {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  publicationYear: number;
  language?: string | null | undefined;
  coverImageUrl?: string | null | undefined;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  totalCopies: number;
  availableCopies: number;
}

export interface BookSearchFilter {
  searchTerm?: string;
  categoryId?: string;
  authorId?: string;
  branchId?: string;
  page: number;
  pageSize: number;
}

export interface CreateBookPayload {
  title: string;
  isbn: string;
  description: string;
  publicationYear: number;
  language?: string | null | undefined;
  coverImageUrl?: string | null | undefined;
  authorId: string;
  categoryId: string;
}

export interface UpdateBookPayload extends CreateBookPayload {
  id: string;
}
