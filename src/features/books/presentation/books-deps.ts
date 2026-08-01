import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { Book, BookSearchFilter, PagedResult, CreateBookPayload, UpdateBookPayload } from '../domain/models/book';
import type { BookMetadata } from '../application/use-cases/get-metadata.use-case';
import { getBooksModule } from '../books-module';

export interface BooksDeps {
  searchBooks(filter: BookSearchFilter): Promise<Result<PagedResult<Book>, AppError>>;
  createBook(payload: CreateBookPayload): Promise<Result<Book, AppError>>;
  updateBook(payload: UpdateBookPayload): Promise<Result<Book, AppError>>;
  deleteBook(id: string): Promise<Result<void, AppError>>;
  getBookMetadata(): Promise<Result<BookMetadata, AppError>>;
}

export function getBooksDeps(): BooksDeps {
  const module = getBooksModule();

  return {
    searchBooks: (filter) => module.searchBooksUseCase.execute(filter),
    createBook: (payload) => module.createBookUseCase.execute(payload),
    updateBook: (payload) => module.updateBookUseCase.execute(payload),
    deleteBook: (id) => module.deleteBookUseCase.execute(id),
    getBookMetadata: () => module.getBookMetadataUseCase.execute(),
  };
}
