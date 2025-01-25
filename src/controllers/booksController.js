import { store } from '../store/store.js';
import { Book } from '../models/book.js';
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
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );

  store.books.push(newBook);
  res.status(201).json(newBook);
};

export const updateBook = (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const bookIndex = store.books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  store.books[bookIndex] = {
    ...store.books[bookIndex],
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
  };

  res.json(store.books[bookIndex]);
};

export const deleteBook = (req, res) => {
  const { id } = req.params;
  const bookIndex = store.books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  store.books.splice(bookIndex, 1);
  res.send('ok');
};
