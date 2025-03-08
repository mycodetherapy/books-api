import User from "../../models/User.js";

import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("user/login", { title: "Login", user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/user/login",
  }),
);

router.get("/signup", (req, res, next) => {
  res.render("user/signup", { title: "Signup", user: req.user });
});
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("errors/400");
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.redirect("/user/login");
  } catch (error) {
    next(error);
  }
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }
  res.render("user/profile", { title: "Profile", user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.render("errors/500");
    }
    res.redirect("/");
  });
});

export default router;
