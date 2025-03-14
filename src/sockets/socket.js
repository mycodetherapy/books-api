import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User is connected:", socket.id);
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
