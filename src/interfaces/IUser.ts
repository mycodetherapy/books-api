import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  favorites?: Types.ObjectId[]; // Array of book IDs
  createdAt?: Date;
  updatedAt?: Date;
}
