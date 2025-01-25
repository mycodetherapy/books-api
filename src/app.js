import express from 'express';
import booksRouter from './routes/books.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/user/login', (req, res) => {
  res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});

app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
