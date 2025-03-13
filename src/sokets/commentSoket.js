import { Server } from "socket.io";
import Book from "../models/Book.js";
import Comment from "../models/Comment.js";

const setupCommentSocket = (server) => {
  const io = new Server(server);

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

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

export default setupCommentSocket;
