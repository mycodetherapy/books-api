import User from "../../models/User.js";

import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/index", { title: "Home", user: req.user });
});

router.get("/login", (req, res) => {
  res.render("user/login", { title: "Login", user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/me",
    failureRedirect: "/user/login",
  }),
);

router.get("/signup", (req, res) => {
  res.render("user/signup", { title: "Signup", user: req.user });
});
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.redirect("/user/login");
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
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
      return res.status(500).json({ message: "Error logging out" });
    }
    res.redirect("/user");
  });
});

export default router;
