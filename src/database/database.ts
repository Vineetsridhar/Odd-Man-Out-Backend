import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "postgres",
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOSTNAME,
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
    await sequelize.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
};
