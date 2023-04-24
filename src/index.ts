import express from "express";
import * as dotenv from "dotenv";
import * as database from "./database/database";
import { Session } from "./models/Session";
import { User } from "./models/User";

dotenv.config();

const startDatabase = async () => {
  await database.connect();
  await database.sync();
};

startDatabase();

const app = express();
const port = 3000;

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/home", async (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const session = await Session.create({
    roomCode: roomCode,
    gameType: "classic",
  });
  const user = await User.create({
    nickname: "vineet",
    isHost: true,
    points: 0,
    sessionId: session.id,
  });
  const sessions = await Session.findAll();

  res.send(
    `My sessions: ${JSON.stringify(sessions)}\n\n${JSON.stringify(user)}`
  );
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
