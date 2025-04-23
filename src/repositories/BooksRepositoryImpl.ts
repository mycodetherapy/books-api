import { injectable } from "inversify";
import { IBook } from "../interfaces/IBook.js";
import Book from "../models/Book.js";
import { BooksRepository } from "./BooksRepository.js";

@injectable()
export class BooksRepositoryImpl extends BooksRepository {
  async createBook(book: IBook): Promise<void> {
    await Book.create(book);
  }

  async getBook(id: string): Promise<IBook | null> {
    return Book.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username",
        },
      })
      .populate("user", "username")
      .populate("favorites", "username");
  }

  async getBooks(
    query: Record<string, any> = {},
    sort: Record<string, 1 | -1> = {},
    skip = 0,
    limit = 20,
  ): Promise<IBook[]> {
    return Book.find(query).sort(sort).skip(skip).limit(limit).lean().exec();
  }

  async updateBook(id: string, updatedBook: Partial<IBook>): Promise<void> {
    await Book.findByIdAndUpdate(id, updatedBook);
  }

  async deleteBook(id: string): Promise<void> {
    await Book.findByIdAndDelete(id);
  }
}
