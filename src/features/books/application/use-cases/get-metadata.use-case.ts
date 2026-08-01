import type { Result } from '@core/result';
import type { AppError } from '@core/errors';
import { err, ok } from '@core/result';
import type { BookGateway } from '../../domain/ports/book-gateway';
import type { Author, Category } from '../../domain/models/book';

export interface BookMetadata {
  authors: Author[];
  categories: Category[];
}

export class GetBookMetadataUseCase {
  public constructor(private readonly gateway: BookGateway) {}

  public async execute(): Promise<Result<BookMetadata, AppError>> {
    const [authorsResult, categoriesResult] = await Promise.all([
      this.gateway.getAllAuthors(),
      this.gateway.getAllCategories()
    ]);

    if (authorsResult.isErr()) return err(authorsResult.error);
    if (categoriesResult.isErr()) return err(categoriesResult.error);

    return ok({
      authors: authorsResult.value,
      categories: categoriesResult.value
    });
  }
}
