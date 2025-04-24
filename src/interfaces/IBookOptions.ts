import { IBook } from "./IBook.js";
import { IUser } from "./IUser.js";

export interface IBookOptions {
  search?: string;
  author?: IBook["authors"];
  sort?: string;
  page?: number;
  limit?: number;
}

export interface IFieldLabels {
  title: IBook["title"];
  authors: IBook["authors"];
  description: NonNullable<IBook["description"]>;
  fileName: IBook["fileName"];
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
  search?: IBookOptions["search"];
  author?: IBookOptions["author"];
  sort?: IBookOptions["sort"];
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
  views?: IBook["views"];
  message?: string;
  user: IUser;
  currentPath: string;
  commentsPage: number;
  commentsLimit: number;
  commentsTotalPages: number;
}
