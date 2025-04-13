import { injectable } from "inversify";
import { FavoritesRepository } from "./FavoritesRepository.js";
import { IFavorite } from "../interfaces/IFavorite.js";
import Favorite from "../models/Favorite.js";
import Book from "../models/Book.js";

@injectable()
export class FavoritesRepositoryImpl extends FavoritesRepository {
  async addFavorite(bookId: string, userId: string): Promise<void> {
    await Book.findByIdAndUpdate(
      bookId,
      { $addToSet: { favorites: userId } },
      { new: true },
    ).exec();
  }

  async removeFavorite(bookId: string, userId: string): Promise<void> {
    await Book.findByIdAndUpdate(
      bookId,
      { $pull: { favorites: userId } },
      { new: true },
    ).exec();
  }

  async getFavoritesByBook(bookId: string): Promise<IFavorite[]> {
    return Favorite.find({ bookId }).populate("userId", "username");
  }
}
