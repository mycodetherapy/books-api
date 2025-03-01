import express from 'express';
import { upload } from '../../middleware/upload.js';
import Book from '../../models/Book.js';
import path from 'path';
import { unlink } from 'fs/promises';
import { trimStrings } from '../../helpers.js';
import axios from 'axios';

const router = express.Router();
// const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:4000";
const COUNTER_SERVICE_URL =
  process.env.COUNTER_SERVICE_URL || 'http://counter-service:4000';

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.find();
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
      authors: 'Authors',
      description: 'Description',
      favorite: 'Favorite',
      fileName: 'File name',
    };
    res.render('book/create', { title: 'Create Book', book: {}, fieldLabels });
  } catch (err) {
    next(err);
  }
});

router.post('/create', upload.single('file'), async (req, res, next) => {
  try {
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, description, authors, fileCover, fileName } = trimStrings(
      req.body
    );
    const favorite = req.body.favorite === 'true';

    const newBook = new Book({
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      filePath,
    });

    await newBook.save();
    res.redirect('/books');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.render('errors/404');
    }

    try {
      await axios.post(`${COUNTER_SERVICE_URL}/counter/${req.params.id}/incr`);
      const { data } = await axios.get(
        `${COUNTER_SERVICE_URL}/counter/${req.params.id}`
      );
      book.views = data.views;
    } catch (error) {
      console.error('Counter service is unavailable:', error.message);
    }

    res.render('book/view', {
      title: 'View Book',
      book,
      views: book.views,
      message: req.query.message,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/update/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
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
    const { title, authors, description, fileName, favorite } = trimStrings(
      req.body
    );
    const book = await Book.findById(req.params.id);

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
    book.description = description || book.description;
    book.fileName = fileName || book.fileName;
    book.favorite = favorite === 'true';

    await book.save();
    res.redirect(
      `/books/${req.params.id}?message=The book has been successfully edited!`
    );
  } catch (err) {
    next(err);
  }
});

router.post('/delete/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.render('errors/404');
    }

    if (book.filePath) {
      try {
        await unlink(path.resolve(`.${book.filePath}`));
      } catch (err) {
        next(err);
      }
    }

    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books?message=The book has been successfully deleted!');
  } catch (err) {
    next(err);
  }
});

export default router;
