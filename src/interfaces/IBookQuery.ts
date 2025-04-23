import { IBook } from "./IBook.js";
import { Types } from "mongoose";
import { IUser } from "./IUser.js";
import { Request } from "express";

export interface IBookQuery {
  search?: string;
  author?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// interfaces/IFieldLabels.ts
export interface IFieldLabels {
  title: string;
  authors: string;
  description: string;
  fileName: string;
}

export interface IIndexRenderOptions {
  title: string;
  books: IBook[];
  message?: string;
  user: IUser;
  currentPath: string;
  currentPage: number;
  totalPages: number;
  limit: number;
  search?: string;
  author?: string;
  sort?: string;
}

export interface ICreateRenderOptions {
  title: string;
  book: Partial<IBook>;
  fieldLabels: IFieldLabels;
  user: IUser;
  currentPath: string;
}

export interface IUpdateRenderOptions {
  title: string;
  book: IBook;
  user: IUser;
}

export interface IViewRenderOptions {
  title: string;
  book: IBook;
  views?: number;
  message?: string;
  user: IUser;
  currentPath: string;
  commentsPage: number;
  commentsLimit: number;
  commentsTotalPages: number;
}

export interface IMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

export interface IRequestWithFile extends Request {
  file?: IMulterFile;
  files?: {
    [fieldname: string]: IMulterFile[];
  };
}

export interface IRequestWithUser extends Request {
  user?: IUser;
}
