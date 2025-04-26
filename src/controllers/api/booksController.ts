import { Request, Response, NextFunction } from "express";
import { container } from "../../container.js";
import { BooksRepository } from "../../repositories/BooksRepository.js";
import path from "path";
import fs from "fs";
import axios from "axios";

const COUNTER_SERVICE_URL =
  process.env.COUNTER_SERVICE_URL || "http://counter-service:4000";

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const booksRepository = container.get(BooksRepository);
    const books = await booksRepository.getBooks();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    try {
      await axios.post(`${COUNTER_SERVICE_URL}/counter/${id}/incr`);
      const { data } = await axios.get(`${COUNTER_SERVICE_URL}/counter/${id}`);
      book.views = data.views;
    } catch (error) {
      console.error(
        "Counter service is unavailable:",
        (error as Error).message,
      );
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, authors, favorite, fileCover, user } = req.body;
    const file = req.file;

    if (!file || !title || !authors) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    if (user?._id) {
      res.status(403).json({ message: "You can only edit books you created." });
    }

    const booksRepository = container.get(BooksRepository);
    await booksRepository.createBook({
      title,
      description,
      authors,
      favorites: favorite,
      fileCover,
      user,
      fileName: file.filename,
      filePath: `/uploads/${file.filename}`,
    });

    res.status(201).json({});
  } catch (error) {
    next(error);
  }
};

export const updateBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file;
    const { title, description, authors, favorite, fileCover } = req.body;

    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (file) {
      if (book.fileName) {
        const oldFilePath = path.resolve("uploads", book.fileName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      book.fileName = file.filename;
      book.filePath = `/uploads/${file.filename}`;
    }

    await booksRepository.updateBook(id, {
      title,
      description,
      authors,
      favorites: favorite,
      fileCover,
      fileName: book.fileName,
      filePath: book.filePath,
    });

    res.status(201).json({});
  } catch (error) {
    next(error);
  }
};

export const deleteBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (book.fileName) {
      const filePath = path.resolve("uploads", book.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await booksRepository.deleteBook(id);
    res.send("ok");
  } catch (error) {
    next(error);
  }
};

export const downloadBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const booksRepository = container.get(BooksRepository);
    const book = await booksRepository.getBook(id);

    if (!book || !book.fileName) {
      res.status(404).json({ error: "Book or file not found" });
      return;
    }

    const filePath = path.resolve("uploads", book.fileName);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.download(filePath, book.fileName);
  } catch (error) {
    next(error);
  }
};
