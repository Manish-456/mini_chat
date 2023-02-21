const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
app.use(cors());
const server = http.createServer(app);

const port = process.env.PORT || 9000;

const io = new Server(server, {
  cors: {
    origin: "https://mini-chat-app-i8hx.onrender.com",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send_message", (data) => {
   socket.broadcast.emit("receive_message", data);
  })
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(port, () => {
  console.log("Server running on port ", port);
});
