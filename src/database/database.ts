import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import { setUpRelationships } from "../models/relations";
dotenv.config();

export const sequelize = new Sequelize(
  "postgres",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOSTNAME,
    dialect: "postgres",
  }
);

export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const sync = async () => {
  try {
    setUpRelationships();
    await sequelize.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
};
