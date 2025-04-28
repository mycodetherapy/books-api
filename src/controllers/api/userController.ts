import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { container } from "../../container.js";
import { UserRepository } from "../../repositories/UserRepository.js";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const userRepository = container.get(UserRepository);

    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    const newUser = await userRepository.createUser({
      username,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error: any) {
    next(error);
  }
};

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info.message });

      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" },
      );

      res.json({ message: "Login successful", token });
    },
  )(req, res, next);
};

export const getProfile = (req: Request, res: Response): void => {
  res.json(req.user);
};

export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: "Logout successful" });
};

export const deleteUser = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepository = container.get(UserRepository);

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const user = await userRepository.deleteUserById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};
