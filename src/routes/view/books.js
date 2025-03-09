import express from "express";
import { upload } from "../../middleware/upload.js";
import Book from "../../models/Book.js";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises";
import { trimStrings } from "../../helpers.js";
import axios from "axios";
import { isAuthenticated } from "../../middleware/auth.js";

const router = express.Router();

// const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:4000";
const COUNTER_SERVICE_URL =
  process.env.COUNTER_SERVICE_URL || "http://counter-service:4000";

router.use(isAuthenticated);

router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find();
    res.render("book/index", {
      title: "Books",
      books,
      message: req.query.message,
      user: req.user,
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/create", (req, res, next) => {
  try {
    const fieldLabels = {
      title: "Title",
      authors: "Authors",
      description: "Description",
      favorite: "Favorite",
      fileName: "File name",
    };
    res.render("book/create", {
      title: "Create Book",
      book: {},
      fieldLabels,
      user: req.user,
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/create", upload.single("file"), async (req, res, next) => {
  try {
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const fileName = req.file ? req.file.filename : null;
    const { title, description, authors, fileCover } = trimStrings(req.body);
    const favorite = req.body.favorite === "true";

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
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    try {
      await axios.post(`${COUNTER_SERVICE_URL}/counter/${req.params.id}/incr`);
      const { data } = await axios.get(
        `${COUNTER_SERVICE_URL}/counter/${req.params.id}`,
      );
      book.views = data.views;
    } catch (error) {
      console.error("Counter service is unavailable:", error.message);
    }

    res.render("book/view", {
      title: "View Book",
      book,
      views: book.views,
      message: req.query.message,
      user: req.user,
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/update/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.render("errors/404");
    }
    res.render("book/update", { title: "Edit Book", book, user: req.user });
  } catch (err) {
    next(err);
  }
});

router.post("/update/:id", upload.single("file"), async (req, res, next) => {
  try {
    const { title, authors, description, favorite } = trimStrings(req.body);
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    if (req.file) {
      if (book.fileName) {
        const oldFilePath = path.resolve("uploads", book.fileName);
        if (fs.existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      }

      book.filePath = `/uploads/${req.file.filename}`;
      book.fileName = req.file.filename;
    }
    book.title = title || book.title;
    book.authors = authors || book.authors;
    book.description = description || book.description;
    book.favorite = favorite === "true";

    await book.save();
    res.redirect(
      `/books/${req.params.id}?message=The book has been successfully edited!`,
    );
  } catch (err) {
    next(err);
  }
});

router.post("/delete/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    if (book.fileName) {
      const filePath = path.resolve("uploads", book.fileName);
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books?message=The book has been successfully deleted!");
  } catch (err) {
    next(err);
  }
});

export default router;
