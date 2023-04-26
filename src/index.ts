import express from "express";
import * as database from "./database/database";
import sessionRouter from "./routes/sessionRouter";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const startDatabase = async () => {
  await database.connect();
  await database.sync();
};

startDatabase();

const app = express();
const port = 3000;

const httpServer = createServer(app);
const io = new Server(httpServer);

app.set("io", io);

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.on("disconnect", () => {
  console.log("user disconnected");
});

app.use(cors());

app.use(bodyParser.json());

app.get("/", async (request, response) => {
  response.send("Hello World!");
});

app.use("/sessions", sessionRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
