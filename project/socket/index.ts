import { Server, Socket } from "socket.io";
import http from "http";

interface ActiveUser {
  userId: string;
  socketId: string;
}
const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let activeUsers: ActiveUser[] = [];

io.on("connection", (socket: Socket) => {
  console.log("New client connected:", socket.id);

  // add new User
  socket.on("new-user-add", (newUserId: string) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on(
    "send-message",
    (data: {
      receiverId: string;
      chatId: string;
      senderId: string;
      [key: string]: any;
    }) => {
      const { receiverId, chatId, senderId } = data;

      const sender = activeUsers.find((user) => user.userId === senderId);
      const senderSocketId = sender?.socketId || socket.id;

      if (chatId) {
        socket.broadcast.emit("receive-message", data);
        return;
      }

      const user = activeUsers.find((user) => user.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("receive-message", data);
      }
    }
  );
});

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
