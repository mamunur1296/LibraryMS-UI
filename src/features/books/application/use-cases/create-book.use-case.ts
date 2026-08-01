import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { BookGateway } from '../../domain/ports/book-gateway';
import type { Book, CreateBookPayload } from '../../domain/models/book';

export class CreateBookUseCase {
  public constructor(private readonly gateway: BookGateway) {}

  public async execute(payload: CreateBookPayload): Promise<Result<Book, AppError>> {
    return this.gateway.createBook(payload);
  }
}
