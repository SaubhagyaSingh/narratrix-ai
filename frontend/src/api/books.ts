import api from "@/lib/api";
import { Book } from "@/types";

export const getBooks = async (): Promise<Book[]> => {
  const res = await api.get("/books/");
  return res.data;
};

export const getBooksByShelf = async (shelfId: string): Promise<Book[]> => {
  const res = await api.get(`/books/shelf/${shelfId}`);
  return res.data;
};

export const createBook = async (data: {
  title: string;
  author: string;
  theme?: string;
  tags: string[];
  shelf_id?: string;
}): Promise<Book> => {
  const res = await api.post("/books/", data);
  
  // backend returns { msg: "Book added", id: "..." }
  // remap to Book shape so _id is always correct
  return {
    _id: res.data.id,
    title: data.title,
    author: data.author,
    theme: data.theme,
    tags: data.tags,
    shelf_id: data.shelf_id,
    has_pdf: false,
  };
};

export const deleteBook = async (bookId: string) => {
  const res = await api.delete(`/books/${bookId}`);
  return res.data;
};