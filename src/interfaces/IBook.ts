import { Types } from "mongoose";

export interface IBook {
  title: string;
  description?: string;
  authors: string;
  favorites?: Types.ObjectId[];
  fileCover: string;
  fileName: string;
  filePath: string;
  views?: number;
  userId: Types.ObjectId;
  comments?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
