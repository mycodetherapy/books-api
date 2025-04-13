import { Types } from "mongoose";

export interface IComment {
  text: string;
  createdAt?: Date;
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
}
