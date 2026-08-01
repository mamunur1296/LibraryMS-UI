import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@shared/ui';
import { X } from 'lucide-react';
import type { Book, CreateBookPayload, UpdateBookPayload } from '../../domain/models/book';
import type { BookMetadata } from '../../application/use-cases/get-metadata.use-case';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | undefined;
  metadata: BookMetadata | undefined;
  isLoadingMetadata: boolean;
  onSubmit: (payload: CreateBookPayload | UpdateBookPayload) => void;
  isSubmitting: boolean;
}

export function BookFormModal({
  isOpen,
  onClose,
  book,
  metadata,
  isLoadingMetadata,
  onSubmit,
  isSubmitting,
}: BookFormModalProps): React.ReactElement {
  const isEditing = book !== undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookPayload>({
    defaultValues: {
      title: '',
      isbn: '',
      description: '',
      publicationYear: new Date().getFullYear(),
      language: 'English',
      authorId: '',
      categoryId: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (book) {
        reset({
          title: book.title,
          isbn: book.isbn,
          description: book.description,
          publicationYear: book.publicationYear,
          language: book.language ?? 'English',
          coverImageUrl: book.coverImageUrl ?? null,
          authorId: book.authorId,
          categoryId: book.categoryId,
        });
      } else {
        reset({
          title: '',
          isbn: '',
          description: '',
          publicationYear: new Date().getFullYear(),
          language: 'English',
          authorId: '',
          categoryId: '',
        });
      }
    }
  }, [isOpen, book, reset]);

  const handleFormSubmit = (data: CreateBookPayload) => {
    if (isEditing && book) {
      onSubmit({ ...data, id: book.id });
    } else {
      onSubmit(data);
    }
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing ? 'Update the details of the book.' : 'Fill in the details to add a new book to the catalog.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={(e) => { void handleSubmit(handleFormSubmit)(e); }} className="space-y-4">
            <Input
              label="Title"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message ?? ''}
              placeholder="e.g. The Great Gatsby"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ISBN"
                {...register('isbn', { required: 'ISBN is required' })}
                error={errors.isbn?.message ?? ''}
                placeholder="e.g. 978-3-16-148410-0"
              />
              <Input
                label="Publication Year"
                type="number"
                {...register('publicationYear', { 
                  required: 'Publication Year is required',
                  valueAsNumber: true,
                  min: { value: 1000, message: 'Invalid year' },
                  max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
                })}
                error={errors.publicationYear?.message ?? ''}
              />
            </div>

            <Input
              label="Language"
              {...register('language')}
              error={errors.language?.message ?? ''}
              placeholder="e.g. English"
            />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Author</label>
            <select
              {...register('authorId', { required: 'Author is required' })}
              className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.authorId ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
              disabled={isLoadingMetadata}
            >
              <option value="">Select Author...</option>
              {metadata?.authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.authorId && <p className="text-xs text-red-500 mt-1">{errors.authorId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.categoryId ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
              disabled={isLoadingMetadata}
            >
              <option value="">Select Category...</option>
              {metadata?.categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            placeholder="Brief description of the book..."
          />
        </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {isEditing ? 'Save Changes' : 'Add Book'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
