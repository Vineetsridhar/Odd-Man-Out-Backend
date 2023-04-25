import express from "express";
import * as database from "./database/database";
import sessionRouter from "./routes/sessionRouter";
import bodyParser from "body-parser";
import cors from "cors";

const startDatabase = async () => {
  await database.connect();
  await database.sync();
};

startDatabase();

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.get("/", async (request, response) => {
  response.send("Hello World!");
});

app.use("/sessions", sessionRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
