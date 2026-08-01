import { err, ok } from '@core/result';
import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import { ServerError } from '@core/errors';
import type { HttpClient } from '@core/http';
import type { BookGateway } from '../domain/ports/book-gateway';
import type { 
  Book, 
  PagedResult, 
  BookSearchFilter, 
  Author, 
  Category, 
  CreateBookPayload, 
  UpdateBookPayload 
} from '../domain/models/book';
import { 
  BookDtoSchema, 
  PagedBookResultSchema, 
  AuthorDtoSchema, 
  CategoryDtoSchema 
} from './dtos/book-dtos';
import { z } from 'zod';

export class BookHttpGateway implements BookGateway {
  public constructor(private readonly http: HttpClient) {}

  public async searchBooks(filter: BookSearchFilter): Promise<Result<PagedResult<Book>, AppError>> {
    try {
      const params = new URLSearchParams();
      if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
      if (filter.categoryId) params.append('categoryId', filter.categoryId);
      if (filter.authorId) params.append('authorId', filter.authorId);
      if (filter.branchId) params.append('branchId', filter.branchId);
      params.append('page', filter.page.toString());
      params.append('pageSize', filter.pageSize.toString());

      const raw = await this.http.get(`/api/v1/Books?${params.toString()}`);
      return ok(PagedBookResultSchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to search books.'));
    }
  }

  public async getBookById(id: string): Promise<Result<Book, AppError>> {
    try {
      const raw = await this.http.get(`/api/v1/Books/${id}`);
      return ok(BookDtoSchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to get book.'));
    }
  }

  public async createBook(payload: CreateBookPayload): Promise<Result<Book, AppError>> {
    try {
      const raw = await this.http.post('/api/v1/Books', payload);
      return ok(BookDtoSchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to create book.'));
    }
  }

  public async updateBook(payload: UpdateBookPayload): Promise<Result<Book, AppError>> {
    try {
      const raw = await this.http.put(`/api/v1/Books/${payload.id}`, payload);
      return ok(BookDtoSchema.parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to update book.'));
    }
  }

  public async deleteBook(id: string): Promise<Result<void, AppError>> {
    try {
      await this.http.delete(`/api/v1/Books/${id}`);
      return ok(undefined);
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to delete book.'));
    }
  }

  public async getAllAuthors(): Promise<Result<Author[], AppError>> {
    try {
      const raw = await this.http.get('/api/v1/Books/authors');
      return ok(z.array(AuthorDtoSchema).parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load authors.'));
    }
  }

  public async getAllCategories(): Promise<Result<Category[], AppError>> {
    try {
      const raw = await this.http.get('/api/v1/Books/categories');
      return ok(z.array(CategoryDtoSchema).parse(raw));
    } catch (error) {
      if (error instanceof Error && 'code' in error) return err(error as AppError);
      return err(new ServerError('Failed to load categories.'));
    }
  }
}
