import { Book } from '../models/book.js';

export const store = {
  books: [
    new Book('Book 1', 'Description 1', 'Author 1'),
    new Book('Book 2', 'Description 2', 'Author 2'),
  ],
};
