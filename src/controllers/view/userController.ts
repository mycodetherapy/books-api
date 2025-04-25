import { Request, Response, NextFunction } from "express";

import passport from "passport";
import User from "../../models/User.js";

export const getLogin = (req: Request, res: Response): void => {
  res.render("user/login", { title: "Login", user: req.user });
};

export const postLogin = passport.authenticate("local", {
  successRedirect: "/books",
  failureRedirect: "/user/login",
});

export const getSignup = (req: Request, res: Response): void => {
  res.render("user/signup", { title: "Signup", user: req.user });
};

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
};

export const getProfile = (req: Request, res: Response): void => {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  res.render("user/profile", {
    title: "Profile",
    user: req.user,
    currentPath: req.path,
  });
};

export const postLogout = (req: Request, res: Response): void => {
  req.logout((err) => {
    if (err) {
      return res.render("errors/500");
    }
    res.redirect("/");
  });
};
