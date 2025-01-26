import { store } from '../store/store.js';
import { Book } from '../models/book.js';
import path from 'path';
import fs from 'fs';
export const getAllBooks = (req, res) => {
  res.json(store.books);
};

export const getBookById = (req, res) => {
  const { id } = req.params;
  const book = store.books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).send('Book not found');
  }

  res.json(book);
};

export const createBook = (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const fileBook = req.file ? req.file.filename : '';
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  store.books.push(newBook);
  res.status(201).json(newBook);
};

export const updateBook = (req, res) => {
  const { id } = req.params;
  const bookIndex = store.books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  const book = store.books[bookIndex];

  if (req.file) {
    const oldFilePath = path.resolve('uploads', book.fileBook);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    book.fileBook = req.file.filename;
  }

  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  book.title = title || book.title;
  book.description = description || book.description;
  book.authors = authors || book.authors;
  book.favorite = favorite !== undefined ? favorite : book.favorite;
  book.fileCover = fileCover || book.fileCover;
  book.fileName = fileName || book.fileName;

  store.books[bookIndex] = book;

  res.json(book);
};

export const downloadBook = (req, res) => {
  const { id } = req.params;

  const book = store.books.find((book) => book.id === id);

  if (!book || !book.fileBook) {
    return res.status(404).send('Book or file not found');
  }

  const filePath = path.resolve('uploads', book.fileBook);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath, book.fileBook);
};

export const deleteBook = (req, res) => {
  const { id } = req.params;
  const bookIndex = store.books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  const book = store.books[bookIndex];

  if (book.fileBook) {
    const filePath = path.resolve('uploads', book.fileBook);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  store.books.splice(bookIndex, 1);

  res.send('ok');
};

// export const deleteBook = (req, res) => {
//   const { id } = req.params;
//   const bookIndex = store.books.findIndex((book) => book.id === id);

//   if (bookIndex === -1) {
//     return res.status(404).send('Book not found');
//   }

//   store.books.splice(bookIndex, 1);
//   res.send('ok');
// };
