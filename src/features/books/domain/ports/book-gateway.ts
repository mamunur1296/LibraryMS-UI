import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { 
  Book, 
  PagedResult, 
  BookSearchFilter, 
  Author, 
  Category, 
  CreateBookPayload, 
  UpdateBookPayload 
} from '../models/book';

export interface BookGateway {
  searchBooks(filter: BookSearchFilter): Promise<Result<PagedResult<Book>, AppError>>;
  getBookById(id: string): Promise<Result<Book, AppError>>;
  createBook(payload: CreateBookPayload): Promise<Result<Book, AppError>>;
  updateBook(payload: UpdateBookPayload): Promise<Result<Book, AppError>>;
  deleteBook(id: string): Promise<Result<void, AppError>>;
  
  getAllAuthors(): Promise<Result<Author[], AppError>>;
  getAllCategories(): Promise<Result<Category[], AppError>>;
}
