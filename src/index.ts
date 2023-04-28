import express from "express";
import * as database from "./database/database";
import roomRouter from "./routes/roomRouter";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import * as http from "http";
import * as dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

const startDatabase = async () => {
  await database.connect();
  await database.sync();
};

startDatabase();

const app = express();
const port = 3000;

const httpServer = http.createServer(app);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/rooms", roomRouter);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomCode) => {
    console.log(`User joined room ${roomCode}`);
    socket.join(roomCode);
  });

  socket.on("leave-room", (roomCode) => {
    console.log(`User left room ${roomCode}`);
    socket.leave(roomCode);
  });
});

httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
