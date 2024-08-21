 express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const colors = require("colors");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}....yellow.bold`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // Set the userId in the socket
    onlineUsers.add(userData._id);
    console.log(onlineUsers);

    io.emit("onlineUser", Array.from(onlineUsers));
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("calling",(e)=>{
    const olo={
      id:e.id,
      sel:e.sel
    }
    socket.in(e.lolo).emit("someCall",(olo))
  })
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("logout", (userId) => {
    onlineUsers.delete(userId);
    console.log("USER LOGOUT", userId);
    io.emit("onlineUser", Array.from(onlineUsers));
    console.log(onlineUsers);
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      console.log("USER DISCONNECTED", socket.userId);
      io.emit("onlineUser", Array.from(onlineUsers));
      console.log(onlineUsers);
    }
  });
});