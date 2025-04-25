import express from "express";
import {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getProfile,
  postLogout,
} from "../../controllers/view/userController.js";

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/me", getProfile);
router.post("/logout", postLogout);

export default router;
