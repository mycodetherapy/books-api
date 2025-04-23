import { IBook } from "../interfaces/IBook.js";

export abstract class BooksRepository {
  abstract createBook(book: IBook): Promise<void>;
  abstract getBook(id: string): Promise<IBook | null>;
  abstract getBooks(
    query?: Record<string, any>,
    sort?: Record<string, 1 | -1>,
    skip?: number,
    limit?: number,
  ): Promise<IBook[]>;
  abstract updateBook(id: string, updatedBook: Partial<IBook>): Promise<void>;
  abstract deleteBook(id: string): Promise<void>;
}
