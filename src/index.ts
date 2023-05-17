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
import { Room } from "./models/Room";
import { User } from "./models/User";
import { setUpRelationships } from "./models/relations";

const startDatabase = async () => {
  await database.connect();
  await database.sync();
  setUpRelationships();
};

startDatabase();

const app = express();
const port = 3000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

io.use((socket, next) => {
  const request = socket.request;
  const response = (request as any).res;
  cookieParser()(request as any, response, (err) => {
    if (err) return next(err);
    next();
  });
});

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/rooms", roomRouter);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", async (roomCode) => {
    console.log(`User joined room ${roomCode}`);
    socket.join(roomCode);

    const room = await Room.findOne({
      where: {
        roomCode,
      },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    socket.to(roomCode).emit("users-change", room.users);
  });

  socket.on("leave-room", async (roomCode) => {
    console.log(`User left room ${roomCode}`);
    socket.leave(roomCode);

    const room = await Room.findOne({
      where: {
        roomCode,
      },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    socket.to(roomCode).emit("users-change", room.users);
  });
});

httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
