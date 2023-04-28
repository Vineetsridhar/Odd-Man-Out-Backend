import express from "express";
import * as database from "./database/database";
import roomRouter from "./routes/roomRouter";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import * as http from "http";
import session from "express-session";
import * as dotenv from "dotenv";
dotenv.config();

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
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use("/rooms", roomRouter);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
