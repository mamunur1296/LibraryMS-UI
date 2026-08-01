import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, BookOpen, MoreVertical } from 'lucide-react';
import { Button, Spinner } from '@shared/ui';
import type { Book } from '../../domain/models/book';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  isAdminOrLibrarian: boolean;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export function BookList({ books, isLoading, isAdminOrLibrarian, onEdit, onDelete }: BookListProps): React.ReactElement {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-indigo-500 mb-4" />
        <p className="text-slate-500">Loading books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">No books found</h3>
        <p className="text-slate-500 max-w-sm">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Title & ISBN</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Published</th>
              <th className="px-6 py-4 text-center">Availability</th>
              {isAdminOrLibrarian && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 bg-indigo-50 rounded shadow-sm flex items-center justify-center border border-indigo-100/50">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">ISBN: {book.isbn}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{book.authorName}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {book.categoryName}
                  </span>
                </td>
                <td className="px-6 py-4">{book.publicationYear}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {book.availableCopies} available
                    </span>
                    <span className="text-xs text-slate-400">of {book.totalCopies} total</span>
                  </div>
                </td>
                {isAdminOrLibrarian && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === book.id ? null : book.id);
                        }}
                        className={`h-8 w-8 p-0 text-slate-400 hover:text-slate-600 transition-opacity ${openDropdownId === book.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {openDropdownId === book.id && (
                        <div
                          className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              onEdit(book);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              onDelete(book.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
