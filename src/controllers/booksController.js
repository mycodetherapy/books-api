import Book from '../models/Book.js';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

// const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:4000";
const COUNTER_SERVICE_URL =
  process.env.COUNTER_SERVICE_URL || 'http://counter-service:4000';

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    try {
      await axios.post(`${COUNTER_SERVICE_URL}/counter/${id}/incr`);
      const { data } = await axios.get(`${COUNTER_SERVICE_URL}/counter/${id}`);
      book.views = data.views;
    } catch (error) {
      console.error('Counter service is unavailable:', error.message);
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, description, authors, favorite, fileCover, fileName } =
      req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

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
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (req.file) {
      const oldFilePath = path.resolve('uploads', book.filePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      book.filePath = `/uploads/${req.file.filename}`;
    }

    const { title, description, authors, favorite, fileCover, fileName } =
      req.body;
    book.title = title || book.title;
    book.description = description || book.description;
    book.authors = authors || book.authors;
    book.favorite = favorite !== undefined ? favorite : book.favorite;
    book.fileCover = fileCover || book.fileCover;
    book.fileName = fileName || book.fileName;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book || !book.filePath) {
      return res.status(404).send('Book or file not found');
    }

    const filePath = path.resolve('uploads', book.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    res.download(filePath, book.filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (book.filePath) {
      const filePath = path.resolve('uploads', book.filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Book.findByIdAndDelete(id);
    res.send('ok');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
