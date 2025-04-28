import express from "express";
import {
  signup,
  login,
  getProfile,
  deleteUser,
  logout,
} from "../../controllers/api/userController.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", passport.authenticate("jwt", { session: false }), getProfile);
router.post("/logout", logout);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUser,
);

export default router;
