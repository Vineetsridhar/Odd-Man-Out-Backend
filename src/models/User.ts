import { DataTypes, Model, Optional, UUIDV1, UUIDV4 } from "sequelize";
import { sequelize } from "../database/database";
import { RoomInstance } from "./Room";

type UserAttributes = {
  id: string;
  nickname: string;
  isHost: boolean;
  points: number;
  roomId: string;
};

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  room?: RoomInstance;
}

export const User = sequelize.define<UserInstance>("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV1,
    primaryKey: true,
    allowNull: false,
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
    type: DataTypes.UUID,
    allowNull: false,
  },
});
