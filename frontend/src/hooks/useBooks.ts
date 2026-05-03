import { useState, useEffect } from "react";
import { getBooks, getBooksByShelf, createBook, deleteBook } from "@/api/books";
import { Book } from "@/types";

export function useBooks(shelfId?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = shelfId ? await getBooksByShelf(shelfId) : await getBooks();
      setBooks(data);
    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [shelfId]);

  const addBook = async (payload: {
    title: string; author: string; theme?: string; tags: string[]; shelf_id?: string;
  }) => {
    const book = await createBook(payload);
    setBooks((prev) => [...prev, book]);
    return book;
  };

  const removeBook = async (bookId: string) => {
    await deleteBook(bookId);
    setBooks((prev) => prev.filter((b) => b._id !== bookId));
  };

  return { books, loading, error, addBook, removeBook, refetch: fetchBooks };
}