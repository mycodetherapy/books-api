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
          path: "userId",
          select: "username",
        },
      })
      .populate("userId", "username")
      .populate("favorites");
  }

  async getBooks(): Promise<IBook[]> {
    return Book.find().lean().exec();
  }

  async updateBook(id: string, updatedBook: Partial<IBook>): Promise<void> {
    await Book.findByIdAndUpdate(id, updatedBook);
  }

  async deleteBook(id: string): Promise<void> {
    await Book.findByIdAndDelete(id);
  }
}
