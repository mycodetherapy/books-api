import express from 'express';
import {
    createBook,
    deleteBook,
    downloadBook,
    getAllBooks,
    getBookById,
    updateBook
} from "../../controllers/booksController.js";
import { upload } from "../../middleware/upload.js"; //upload from "../../middleware/upload.js";

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', upload.single('fileBook'), createBook);
router.put('/:id', upload.single('fileBook'), updateBook);
router.delete('/:id', deleteBook);
router.get('/:id/download', downloadBook);

export default router;
