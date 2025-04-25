import express from "express";
import {
  getBooks,
  getCreateBook,
  postCreateBook,
  getUpdateBook,
  postUpdateBook,
  deleteBook,
  getBook,
} from "../../controllers/view/bookController.js";
import { upload } from "../../middleware/upload.js";
import { isAuthenticated } from "../../middleware/auth.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/", getBooks);
router.get("/create", getCreateBook);
router.post("/create", upload.single("file"), postCreateBook);
router.get("/update/:id", getUpdateBook);
router.post("/update/:id", upload.single("file"), postUpdateBook);
router.post("/delete/:id", deleteBook);
router.get("/:id", getBook);

export default router;
