import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database/database";
import { User } from "./User";

type GameType = "classic";
type SessionAttributes = {
  id: string;
  roomCode: string;
  gameEndedAt?: Date;
  gameStartedAt?: Date;
  gameType: GameType;
};

type SessionCreationAttributes = Optional<SessionAttributes, "id">;

interface SessionInstance
  extends Model<SessionAttributes, SessionCreationAttributes>,
    SessionAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const Session = sequelize.define<SessionInstance>(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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

Session.hasMany(User, {
  sourceKey: "id",
  foreignKey: "sessionId",
  as: "users",
});

User.belongsTo(Session, {
  foreignKey: "sessionId",
  as: "session",
});
