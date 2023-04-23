import { Sequelize } from "sequelize";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  "postgres",
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOSTNAME,
    dialect: "postgres",
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connect();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
