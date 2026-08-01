import React, { useState } from 'react';
import { Plus, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { useBooksSearch, useCreateBook, useUpdateBook, useDeleteBook, useBookMetadata } from './use-books';
import { BookList } from './components/BookList';
import { BookFilters } from './components/BookFilters';
import { BookFormModal } from './components/BookFormModal';
import type { BookFiltersState } from './components/BookFilters';
import type { Book, CreateBookPayload, UpdateBookPayload } from '../domain/models/book';

export function BooksPage(): React.ReactElement {
  const { isAdmin, isLibrarian } = useAuth();
  const isAdminOrLibrarian = isAdmin || isLibrarian;

  const [filters, setFilters] = useState<BookFiltersState>({
    searchTerm: '',
    categoryId: '',
    authorId: '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Data fetching
  const { data: searchResult, isLoading: isSearchLoading } = useBooksSearch({ ...filters, page, pageSize });
  const { data: metadata, isLoading: isLoadingMetadata } = useBookMetadata();

  // Mutations
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleOpenModal = (book?: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(undefined);
  };

  const handleSubmit = (payload: CreateBookPayload | UpdateBookPayload) => {
    if ('id' in payload) {
      updateBookMutation.mutate(payload as UpdateBookPayload, {
        onSuccess: () => handleCloseModal(),
      });
    } else {
      createBookMutation.mutate(payload as CreateBookPayload, {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleDelete = (id: string) => {
    setBookToDelete(id);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete, {
        onSuccess: () => setBookToDelete(null),
      });
    }
  };

  const cancelDelete = () => {
    setBookToDelete(null);
  };

  const handleFilterChange = (newFilters: BookFiltersState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Book Catalog</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage library books and inventory</p>
          </div>
        </div>
        {isAdminOrLibrarian && (
          <Button variant="primary" onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>
        )}
      </div>

      {/* Filters */}
      <BookFilters
        filters={filters}
        metadata={metadata}
        isLoadingMetadata={isLoadingMetadata}
        onFilterChange={handleFilterChange}
      />

      {/* List */}
      <BookList
        books={searchResult?.items ?? []}
        isLoading={isSearchLoading}
        isAdminOrLibrarian={isAdminOrLibrarian}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {searchResult !== undefined && searchResult.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded-xl sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * pageSize, searchResult.totalCount)}
                </span>{' '}
                of <span className="font-medium">{searchResult.totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!searchResult.hasPreviousPage}
                  className="rounded-l-md rounded-r-none border-slate-300 text-slate-500 hover:bg-slate-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                {/* Simple page numbers */}
                {[...Array(searchResult.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === i + 1
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(searchResult.totalPages, p + 1))}
                  disabled={!searchResult.hasNextPage}
                  className="rounded-r-md rounded-l-none border-slate-300 text-slate-500 hover:bg-slate-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BookFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          book={editingBook}
          metadata={metadata}
          isLoadingMetadata={isLoadingMetadata}
          onSubmit={handleSubmit}
          isSubmitting={createBookMutation.isPending || updateBookMutation.isPending}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Book</h3>
              <p className="text-slate-500 text-sm">
                Are you sure you want to delete this book? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={cancelDelete} disabled={deleteBookMutation.isPending}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={confirmDelete} isLoading={deleteBookMutation.isPending} className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-500 border-transparent text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
