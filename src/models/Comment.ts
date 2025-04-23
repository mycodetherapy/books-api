import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
