import type { HttpClient } from '@core/http';
import { BookHttpGateway } from './infrastructure/book-http-gateway';
import { SearchBooksUseCase } from './application/use-cases/search-books.use-case';
import { CreateBookUseCase } from './application/use-cases/create-book.use-case';
import { UpdateBookUseCase } from './application/use-cases/update-book.use-case';
import { DeleteBookUseCase } from './application/use-cases/delete-book.use-case';
import { GetBookMetadataUseCase } from './application/use-cases/get-metadata.use-case';

export interface BooksModuleConfig {
  http: HttpClient;
}

export interface BooksModule {
  searchBooksUseCase: SearchBooksUseCase;
  createBookUseCase: CreateBookUseCase;
  updateBookUseCase: UpdateBookUseCase;
  deleteBookUseCase: DeleteBookUseCase;
  getBookMetadataUseCase: GetBookMetadataUseCase;
}

let booksModuleInstance: BooksModule | null = null;

export function createBooksModule(config: BooksModuleConfig): BooksModule {
  const gateway = new BookHttpGateway(config.http);

  booksModuleInstance = {
    searchBooksUseCase: new SearchBooksUseCase(gateway),
    createBookUseCase: new CreateBookUseCase(gateway),
    updateBookUseCase: new UpdateBookUseCase(gateway),
    deleteBookUseCase: new DeleteBookUseCase(gateway),
    getBookMetadataUseCase: new GetBookMetadataUseCase(gateway),
  };

  return booksModuleInstance;
}

export function getBooksModule(): BooksModule {
  if (booksModuleInstance === null) {
    throw new Error('Books module not initialized. Call createBooksModule() first at the composition root.');
  }
  return booksModuleInstance;
}
