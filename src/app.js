import express from 'express';
import booksRouter from './routes/view/books.js';
import apiBooksRouter from './routes/api/books.js';
import fs from 'fs';
import path from 'path';
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/error-404.js';
import { errorHandler } from './middleware/error-500.js';
import connectBooksDB from './db/booksdb.js';
import userRoutes from './routes/view/user.js';
import session from "express-session";
import passport from "passport";
import './config/passport.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));

app.use(session({ secret: 'SECRET'}));

app.use(passport.initialize())
app.use(passport.session())

app.use('/user', userRoutes);

 await connectBooksDB();

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use('/books', booksRouter);
app.use('/api/books', apiBooksRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
