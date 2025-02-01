import express from 'express';
import { upload } from '../middleware/upload.js';
import { Book } from '../models/book.js';
import { store } from '../store/store.js';
import path from 'path';
import { unlink } from 'fs/promises';

const router = express.Router();

router.get('/', (req, res) => {
  const { books } = store;
  res.render('book/index', { title: 'Books', books });
});

router.get('/create', (req, res) => {
  console.log('req.file', req.body);

  const fieldLabels = {
    title: 'Title',
    authors: 'Authors Names',
    description: 'Book Description',
  };
  res.render('book/create', { title: 'Create Book', book: {}, fieldLabels });
});

router.post('/create', upload.single('file'), (req, res) => {
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  console.log('filePath', req.file);

  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    filePath
  );
  store.books.push(newBook);
  res.redirect('/books');
});

router.get('/:id', (req, res) => {
  const { books } = store;
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.redirect('/404');
  }
  console.log('book wiew', book);

  res.render('book/view', { title: 'View Book', book });
});

router.get('/update/:id', (req, res) => {
  const { books } = store;
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.redirect('/404');
  }
  res.render('book/update', { title: 'Edit Book', book });
});

router.post('/update/:id', upload.single('file'), async (req, res) => {
  const { books } = store;
  const { title, authors, description } = req.body;
  const book = books.find((b) => b.id === req.params.id);

  if (!book) {
    return res.redirect('/404');
  }

  if (req.file && book.filePath) {
    try {
      await unlink(path.resolve(`.${book.filePath}`));
    } catch (err) {
      console.error('Ошибка при удалении файла:', err);
    }
    book.filePath = `/uploads/${req.file.filename}`;
  }

  book.title = title;
  book.authors = authors;
  book.description = description;

  res.redirect(`/books/${req.params.id}`);
});

router.post('/delete/:id', async (req, res) => {
  const { books } = store;
  const index = books.findIndex((b) => b.id === req.params.id);

  if (index === -1) {
    return res.redirect('/404');
  }

  const book = books[index];

  if (book.filePath) {
    try {
      await unlink(path.resolve(`.${book.filePath}`));
    } catch (err) {
      console.error('Ошибка при удалении файла:', err);
    }
  }

  books.splice(index, 1);
  res.redirect('/books');
});

export default router;
