import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import session from "express-session";
import passport from "passport";

import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/error-404.js";
import { errorHandler } from "./middleware/error-500.js";
import { badRequest } from "./middleware/error-400.js";

import connectBooksDB from "./db/booksdb.js";
import booksRouter from "./routes/view/books.js";
import apiBooksRouter from "./routes/api/books.js";
import homeRoutes from "./routes/view/home.js";
import userRoutes from "./routes/view/user.js";
import userApiRoutes from "./routes/api/user.js";

import "./config/passport.js";
import setupCommentSocket from "./sockets/commentSocket.js";
import setupFavoriteSocket from "./sockets/favoriteSocket.js";
import { initSocket } from "./sockets/socket.js";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
initSocket(server);

app.set("view engine", "ejs");

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("public")));

app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.message = req.message;
  next();
});

app.use("/", homeRoutes);
app.use("/api/user", userApiRoutes);
app.use("/user", userRoutes);
app.use("/books", booksRouter);
app.use("/api/books", apiBooksRouter);

(async () => {
  try {
    await connectBooksDB();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
})();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

setupCommentSocket();
setupFavoriteSocket();

app.use(notFound);
app.use(errorHandler);
app.use(badRequest);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});
