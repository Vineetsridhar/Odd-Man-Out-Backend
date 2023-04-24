import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

type UserAttributes = {
  id: string;
  nickname: string;
  isHost: boolean;
  points: number;
  sessionId: string;
};

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const User = sequelize.define<UserInstance>("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
