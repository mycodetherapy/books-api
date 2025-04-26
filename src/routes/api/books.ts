import { Router } from "express";
import { upload } from "../../middleware/upload.js";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  downloadBookById,
} from "../../controllers/api/booksController.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", upload.single("fileBook"), createBook);
router.put("/:id", upload.single("fileBook"), updateBookById);
router.delete("/:id", deleteBookById);
router.get("/:id/download", downloadBookById);

export default router;
