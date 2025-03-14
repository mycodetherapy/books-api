import Book from "../models/Book.js";
import Comment from "../models/Comment.js";
import { getIO } from "./socket.js";

const setupCommentSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    console.log("a user connected");
    const { bookId } = socket.handshake.query;
    socket.join(bookId); // Подключаем сокет к комнате с ID книги

    socket.on("newComment", async (data) => {
      const { text, userId } = data;

      try {
        const newComment = new Comment({ text, bookId, userId });
        await newComment.save();

        await Book.findByIdAndUpdate(bookId, {
          $push: { comments: newComment._id },
        });

        const populatedComment = await Comment.findById(
          newComment._id,
        ).populate("userId", "username");

        io.to(bookId).emit("newComment", populatedComment);
      } catch (err) {
        console.error("Error saving comment:", err);
      }
    });

    socket.on("deleteComment", async (data) => {
      const { commentId, userId } = data;

      try {
        const comment = await Comment.findById(commentId);
        if (!comment || comment.userId.toString() !== userId) {
          return socket.emit("deleteCommentError", {
            message: "You can only delete your own comments",
          });
        }

        await Comment.findByIdAndDelete(commentId);

        await Book.findByIdAndUpdate(bookId, {
          $pull: { comments: commentId },
        });

        io.to(bookId).emit("commentDeleted", { commentId });
      } catch (err) {
        console.error("Error deleting comment:", err);
        socket.emit("deleteCommentError", {
          message: "Failed to delete comment",
        });
      }
    });

    socket.on("updateComment", async (data) => {
      const { commentId, text, userId } = data;

      try {
        const comment = await Comment.findById(commentId);
        if (!comment || comment.userId.toString() !== userId) {
          return socket.emit("updateCommentError", {
            message: "You can only edit your own comments",
          });
        }

        comment.text = text;
        await comment.save();

        io.to(bookId).emit("commentUpdated", { commentId, text });
      } catch (err) {
        console.error("Error updating comment:", err);
        socket.emit("updateCommentError", {
          message: "Failed to update comment",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

export default setupCommentSocket;
