import Book from "../models/Book.js";
import { getIO } from "./socket.js";

const setupFavoriteSocket = () => {
  const io = getIO();
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("toggleFavorite", async (data) => {
      const { bookId, userId } = data;

      try {
        const book = await Book.findById(bookId);
        if (!book) {
          return socket.emit("toggleFavoriteError", {
            message: "Book not found",
          });
        }

        const userIndex = book.favorites.indexOf(userId);

        if (userIndex === -1) {
          book.favorites.push(userId);
        } else {
          book.favorites.splice(userIndex, 1);
        }

        await book.save();

        io.emit("favoriteUpdated", {
          bookId,
          favorites: book.favorites.length,
        });
      } catch (err) {
        console.error("Error toggling favorite:", err);
        socket.emit("toggleFavoriteError", {
          message: "Failed to update favorites",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

export default setupFavoriteSocket;
