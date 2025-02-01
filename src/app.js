// import express from 'express';
// import booksRouter from './routes/books.js';
// import bodyParser from 'body-parser';
// import path from 'path';

// const app = express();

// app.set('view engine', 'ejs');

// // Роуты
// app.use('/books', booksRouter);

// // 404
// app.use((req, res) => {
//   res.status(404).send('Page not found');
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import express from 'express';
import booksRouter from './routes/books.js';
import fs from 'fs';
import path from 'path';
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/error-404.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));

app.post('/api/user/login', (req, res) => {
  res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use('/books', booksRouter);

app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
