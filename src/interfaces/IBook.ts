import { Types } from "mongoose";

export interface IBook {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  authors: string;
  favorites?: Types.ObjectId[];
  fileCover: string;
  fileName: string;
  filePath: string;
  views?: number;
  user: Types.ObjectId;
  comments?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
