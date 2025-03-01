import mongoose from 'mongoose';

const connectBooksDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/books'
    );
    console.log('BooksDB connected');
  } catch (error) {
    console.error('BooksDB connection error:', error);
    process.exit(1);
  }
};

export default connectBooksDB;
