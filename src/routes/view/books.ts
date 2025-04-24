import express from "express";
import Book from "../../models/Book.js";
import Comment from "../../models/Comment.js";
import path from "path";
import fs from "fs";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import { container } from "../../container.js";
import {
  IBookOptions,
  IViewRenderOptions,
  IUpdateRenderOptions,
  ICreateRenderOptions,
  IIndexRenderOptions,
  IFieldLabels,
} from "../../interfaces/IBookOptions.js";
import { BooksRepository } from "../../repositories/BooksRepository.js";
import { IBook } from "../../interfaces/IBook.js";
import { Types } from "mongoose";
import { IUser } from "../../interfaces/IUser.js";
import { promisify } from "node:util";
import { upload } from "../../middleware/upload.js";
import { trimStrings } from "../../helpers.js";

const router = express.Router();

// const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:4000";
const COUNTER_SERVICE_URL =
  process.env.COUNTER_SERVICE_URL || "http://counter-service:4000";

router.use(isAuthenticated);

const unlink = promisify(fs.unlink);

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      search,
      author,
      sort,
      page = 1,
      limit = 20,
    } = req.query as unknown as IBookOptions;
    const query: Record<string, any> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (author) {
      query.authors = { $regex: author, $options: "i" };
    }

    const sortOptions: Record<string, 1 | -1> = {};
    if (sort) {
      sortOptions[sort] = 1;
    }

    const skip = (page - 1) * limit;

    const booksRepository = container.get(BooksRepository);
    const books = await booksRepository.getBooks(
      query,
      sortOptions,
      skip,
      parseInt(limit.toString()),
    );

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / parseInt(limit.toString()));

    const renderOptions: IIndexRenderOptions = {
      title: "Books",
      books,
      message: req.query.message as string | undefined,
      user: req.user as IUser,
      currentPath: req.path,
      currentPage: parseInt(page.toString()),
      totalPages,
      limit: parseInt(limit.toString()),
      search,
      author,
      sort,
    };

    res.render("book/index", renderOptions);
  } catch (err) {
    next(err);
  }
};

export const getCreateBook = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const fieldLabels: IFieldLabels = {
      title: "Title",
      authors: "Authors",
      description: "Description",
      fileName: "File name",
    };

    const renderOptions: ICreateRenderOptions = {
      title: "Create Book",
      book: {},
      fieldLabels,
      user: req.user as IUser,
      currentPath: req.path,
    };

    res.render("book/create", renderOptions);
  } catch (err) {
    next(err);
  }
};

export const postCreateBook = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const fileName = req.file ? req.file.filename : null;
    const { title, description, authors, fileCover } = trimStrings(req.body);

    console.log("req?.user", req.user);

    const newBook: IBook = {
      title,
      description,
      authors,
      fileCover,
      fileName: fileName || "",
      filePath: filePath || "",
      user: new Types.ObjectId(req?.user?._id),
      comments: [],
      favorites: [],
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const booksRepository = container.get(BooksRepository);
    await booksRepository.createBook(newBook);

    res.redirect("/books");
  } catch (err) {
    next(err);
  }
};

export const getUpdateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    const renderOptions: IUpdateRenderOptions = {
      title: "Edit Book",
      book,
      user: req.user as IUser,
    };

    res.render("book/update", renderOptions);
  } catch (err) {
    next(err);
  }
};

export const postUpdateBook = async (
  req: any, //IRequestWithFile & IRequestWithUser,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, authors, description } = trimStrings(req.body);
    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    if (book.user._id.toString() !== req?.user?._id.toString()) {
      return res.status(403).render("errors/403", {
        message: "You can only edit books you created.",
      });
    }

    const updatedBook: Partial<IBook> = {
      title: title || book.title,
      authors: authors || book.authors,
      description: description || book.description,
      updatedAt: new Date(),
    };

    if (req.file) {
      if (book.fileName) {
        const oldFilePath = path.resolve("uploads", book.fileName);
        if (fs.existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      }

      updatedBook.filePath = `/uploads/${req.file.filename}`;
      updatedBook.fileName = req.file.filename;
    }

    await booksRepository.updateBook(req.params.id, updatedBook);
    res.redirect(
      `/books/${req.params.id}?message=The book has been successfully edited!`,
    );
  } catch (err) {
    next(err);
  }
};

export const getBook = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(id);

    if (!book) {
      return res.render("errors/404");
    }

    const totalComments = await Comment.countDocuments({ bookId: id });
    const totalPages = Math.ceil(totalComments / parseInt(limit.toString()));

    if (book.user._id.toString() !== req?.user?._id.toString()) {
      try {
        await axios.post(
          `${COUNTER_SERVICE_URL}/counter/${req.params.id}/incr`,
        );
        const { data } = await axios.get(
          `${COUNTER_SERVICE_URL}/counter/${req.params.id}`,
        );
        book.views = data.views;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Counter service is unavailable:", error.message);
        } else {
          console.error("Unknown error occurred in counter service:", error);
        }
      }
    }

    const renderOptions: IViewRenderOptions = {
      title: "View Book",
      book,
      views: book.views,
      message: req.query.message as string | undefined,
      user: req.user as IUser,
      currentPath: req.path,
      commentsPage: parseInt(page.toString()),
      commentsLimit: parseInt(limit.toString()),
      commentsTotalPages: totalPages,
    };

    res.render("book/view", renderOptions);
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    if (book.user._id.toString() !== req?.user?._id.toString()) {
      return res.status(403).render("errors/403", {
        message: "You can only delete books you created.",
      });
    }

    if (book.fileName) {
      const filePath = path.resolve("uploads", book.fileName);
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    await Comment.deleteMany({ bookId: book._id });
    await booksRepository.deleteBook(req.params.id);
    res.redirect("/books?message=The book has been successfully deleted!");
  } catch (err) {
    next(err);
  }
};

router.get("/", getBooks);
router.get("/create", getCreateBook);
router.post("/create", upload.single("file"), postCreateBook);
router.get("/update/:id", getUpdateBook);
router.post("/update/:id", upload.single("file"), postUpdateBook);
router.post("/delete/:id", deleteBook);
router.get("/:id", getBook);

export default router;
