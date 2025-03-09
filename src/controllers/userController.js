import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.json({ message: "Login successful", token });
  })(req, res, next);
};

export const getProfile = (req, res) => {
  res.json(req.user);
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("id", id);
    console.log("req.user._id", req.user._id);

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
