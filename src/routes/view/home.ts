import express from "express";
import Book from "../../models/Book.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.render("home/index", {
      title: "Home",
      user: req.user,
      message: req.query.message,
      books: req.isAuthenticated() ? books : null,
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading books", error: err });
  }
});

export default router;
