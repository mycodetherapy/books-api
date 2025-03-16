import express from "express";
import { upload } from "../../middleware/upload.js";
import Book from "../../models/Book.js";
import Comment from "../../models/Comment.js";
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
    const { search, author, sort, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (author) {
      query.authors = { $regex: author, $options: "i" };
    }

    const sortOptions = {};
    if (sort) {
      sortOptions[sort] = 1;
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);

    res.render("book/index", {
      title: "Books",
      books,
      message: req.query.message,
      user: req.user,
      currentPath: req.path,
      currentPage: parseInt(page),
      totalPages,
      limit: parseInt(limit),
      search,
      author,
      sort,
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

    const newBook = new Book({
      title,
      description,
      authors,
      fileCover,
      fileName,
      filePath,
      userId: req.user.id,
    });

    await newBook.save();
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const book = await Book.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username",
      },
      options: {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
        sort: { createdAt: -1 },
      },
    });

    if (!book) {
      return res.render("errors/404");
    }

    const totalComments = await Comment.countDocuments({ bookId: id });
    const totalPages = Math.ceil(totalComments / limit);

    if (book.userId.toString() !== req.user.id) {
      try {
        await axios.post(
          `${COUNTER_SERVICE_URL}/counter/${req.params.id}/incr`,
        );
        const { data } = await axios.get(
          `${COUNTER_SERVICE_URL}/counter/${req.params.id}`,
        );
        book.views = data.views;
      } catch (error) {
        console.error("Counter service is unavailable:", error.message);
      }
    }

    res.render("book/view", {
      title: "View Book",
      book,
      views: book.views,
      message: req.query.message,
      user: req.user,
      currentPath: req.path,
      commentsPage: parseInt(page),
      commentsLimit: parseInt(limit),
      commentsTotalPages: totalPages,
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
    const { title, authors, description } = trimStrings(req.body);
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.render("errors/404");
    }

    if (book.userId.toString() !== req.user.id) {
      return res.status(403).render("errors/403", {
        message: "You can only edit books you created.",
      });
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

    if (book.userId.toString() !== req.user.id) {
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
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books?message=The book has been successfully deleted!");
  } catch (err) {
    next(err);
  }
});

export default router;
