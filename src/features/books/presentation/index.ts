// Export presentation hooks and components
export { getBooksDeps } from './books-deps';
export type { BooksDeps } from './books-deps';
export { useBooksSearch, useBookMetadata, useCreateBook, useUpdateBook, useDeleteBook } from './use-books';

// Note: BooksPage is NOT exported here because pages are code-split and loaded dynamically by the router.
// Do not export route-level components in feature barrels.
