import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { BookGateway } from '../../domain/ports/book-gateway';
import type { Book, BookSearchFilter, PagedResult } from '../../domain/models/book';

export class SearchBooksUseCase {
  public constructor(private readonly gateway: BookGateway) {}

  public async execute(filter: BookSearchFilter): Promise<Result<PagedResult<Book>, AppError>> {
    return this.gateway.searchBooks(filter);
  }
}
