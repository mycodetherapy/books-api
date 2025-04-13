import { IFavorite } from "../interfaces/IFavorite.js";

export abstract class FavoritesRepository {
  abstract addFavorite(bookId: string, userId: string): Promise<void>;
  abstract removeFavorite(bookId: string, userId: string): Promise<void>;
  abstract getFavoritesByBook(bookId: string): Promise<IFavorite[]>;
}
