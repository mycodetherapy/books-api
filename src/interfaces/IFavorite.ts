import { Types } from "mongoose";

export interface IFavorite {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt?: Date;
}
