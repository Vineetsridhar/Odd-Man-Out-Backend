import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

type UserAttributes = {
  sessionId: string;
  nickname: string;
  isHost: boolean;
  points: number;
  roomId: string;
};

interface UserCreationAttributes extends Optional<UserAttributes, "sid"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const User = sequelize.define<UserInstance>("User", {
  sessionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isHost: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
