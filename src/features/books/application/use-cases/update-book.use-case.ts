import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { BookGateway } from '../../domain/ports/book-gateway';
import type { Book, UpdateBookPayload } from '../../domain/models/book';

export class UpdateBookUseCase {
  public constructor(private readonly gateway: BookGateway) {}

  public async execute(payload: UpdateBookPayload): Promise<Result<Book, AppError>> {
    return this.gateway.updateBook(payload);
  }
}
