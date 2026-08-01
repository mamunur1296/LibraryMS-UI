import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import type { BookGateway } from '../../domain/ports/book-gateway';

export class DeleteBookUseCase {
  public constructor(private readonly gateway: BookGateway) {}

  public async execute(id: string): Promise<Result<void, AppError>> {
    return this.gateway.deleteBook(id);
  }
}
