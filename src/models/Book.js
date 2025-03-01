import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', required: true },
    description: { type: String, default: '' },
    authors: { type: String, default: '', required: true },
    favorite: { type: Boolean, default: false },
    fileCover: { type: String, default: '' },
    fileName: { type: String, default: '' },
    filePath: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;
