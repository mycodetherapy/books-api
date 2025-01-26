import express from 'express';
import booksRouter from './routes/books.js';
import fs from 'fs';
import path from 'path';
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/error-404.js';

const app = express();
const PORT = 3000;

app.use(logger);

app.use(express.json());

app.post('/api/user/login', (req, res) => {
  res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use('/api/books', booksRouter);

app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
