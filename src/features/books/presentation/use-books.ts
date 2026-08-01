import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooksDeps } from './books-deps';
import type { BookSearchFilter, CreateBookPayload, UpdateBookPayload } from '../domain/models/book';
import toast from 'react-hot-toast';

export function useBooksSearch(filter: BookSearchFilter) {
  return useQuery({
    queryKey: ['books', filter],
    queryFn: async () => {
      const result = await getBooksDeps().searchBooks(filter);
      if (result.isErr()) throw result.error;
      return result.value;
    },
    staleTime: 30_000,
  });
}

export function useBookMetadata() {
  return useQuery({
    queryKey: ['book-metadata'],
    queryFn: async () => {
      const result = await getBooksDeps().getBookMetadata();
      if (result.isErr()) throw result.error;
      return result.value;
    },
    staleTime: 300_000, // 5 minutes (authors and categories rarely change)
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBookPayload) => {
      const result = await getBooksDeps().createBook(payload);
      if (result.isErr()) throw result.error;
      return result.value;
    },
    onSuccess: () => {
      toast.success('Book created successfully!');
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBookPayload) => {
      const result = await getBooksDeps().updateBook(payload);
      if (result.isErr()) throw result.error;
      return result.value;
    },
    onSuccess: () => {
      toast.success('Book updated successfully!');
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await getBooksDeps().deleteBook(id);
      if (result.isErr()) throw result.error;
    },
    onSuccess: () => {
      toast.success('Book deleted successfully!');
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
