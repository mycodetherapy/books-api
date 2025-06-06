import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", required: true },
    description: { type: String, default: "" },
    authors: { type: String, default: "", required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    fileCover: { type: String, default: "" },
    fileName: { type: String, default: "" },
    filePath: { type: String, default: "" },
    views: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
