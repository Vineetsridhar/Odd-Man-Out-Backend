import { DataTypes, Model, Optional, Sequelize, UUIDV1 } from "sequelize";
import { sequelize } from "../database/database";
import { User, UserInstance } from "./User";

type GameType = "classic";
type RoomAttributes = {
  id: string;
  roomCode: string;
  gameEndedAt?: Date;
  gameStartedAt?: Date;
  gameType: GameType;
};

type RoomCreationAttributes = Optional<RoomAttributes, "id">;

export interface RoomInstance
  extends Model<RoomAttributes, RoomCreationAttributes>,
    RoomAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  users?: UserInstance[];
}

export const Room = sequelize.define<RoomInstance>(
  "Room",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    roomCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gameEndedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gameStartedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gameType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [{ unique: true, fields: ["roomCode"] }],
  }
);

Room.hasMany(User, {
  sourceKey: "id",
  foreignKey: "roomId",
  as: "users",
});

User.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});
