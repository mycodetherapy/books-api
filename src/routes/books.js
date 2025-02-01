import express from 'express';
import { upload } from '../middleware/upload.js';
import { Book } from '../models/book.js';
import { store } from '../store/store.js';
import path from 'path';
import { unlink } from 'fs/promises';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { books } = store;
    res.render('book/index', {
      title: 'Books',
      books,
      message: req.query.message,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/create', (req, res, next) => {
  try {
    const fieldLabels = {
      title: 'Title',
      authors: 'Authors Names',
      description: 'Book Description',
    };
    res.render('book/create', { title: 'Create Book', book: {}, fieldLabels });
  } catch (err) {
    next(err);
  }
});

router.post('/create', upload.single('file'), async (req, res, next) => {
  try {
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
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
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const { books } = store;
    const book = books.find((b) => b.id === req.params.id);
    if (!book) {
      return res.render('errors/404');
    }
    res.render('book/view', { title: 'View Book', book });
  } catch (err) {
    next(err);
  }
});

router.get('/update/:id', (req, res, next) => {
  try {
    const { books } = store;
    const book = books.find((b) => b.id === req.params.id);
    if (!book) {
      return res.render('errors/404');
    }
    res.render('book/update', { title: 'Edit Book', book });
  } catch (err) {
    next(err);
  }
});

router.post('/update/:id', upload.single('file'), async (req, res, next) => {
  try {
    const { books } = store;
    const { title, authors, description } = req.body;
    const book = books.find((b) => b.id === req.params.id);

    if (!book) {
      return res.render('errors/404');
    }

    if (req.file && book.filePath) {
      try {
        await unlink(path.resolve(`.${book.filePath}`));
      } catch (err) {
        next(err);
      }
      book.filePath = `/uploads/${req.file.filename}`;
    }

    book.title = title;
    book.authors = authors;
    book.description = description.trim();

    res.redirect(`/books/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.post('/delete/:id', async (req, res, next) => {
  try {
    const { books } = store;
    const index = books.findIndex((b) => b.id === req.params.id);

    if (index === -1) {
      return res.render('errors/404');
    }

    const book = books[index];

    if (book.filePath) {
      try {
        await unlink(path.resolve(`.${book.filePath}`));
      } catch (err) {
        next(err);
      }
    }

    books.splice(index, 1);
    res.redirect('/books?message=The book has been successfully deleted!');
  } catch (err) {
    next(err);
  }
});

export default router;
