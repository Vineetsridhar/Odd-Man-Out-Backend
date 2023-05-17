import { DataTypes, Model, Optional, UUIDV1 } from "sequelize";
import { sequelize } from "../database/database";
import { RoomInstance } from "./Room";
import { RoundInstance } from "./Round";
import { UserInstance } from "./User";
import { VoteInstance } from "./Vote";

type AnswerAttributes = {
  id: string;
  answer: string;
  userId: string;
  roundId: string;
  roomId: string;
};

type AnswerCreationAttributes = Optional<AnswerAttributes, "id">;

export interface AnswerInstance
  extends Model<AnswerAttributes, AnswerCreationAttributes>,
    AnswerAttributes {
  createdAt?: Date;
  user?: UserInstance;
  round?: RoundInstance;
  room?: RoomInstance;
  votes?: VoteInstance[];
}

export const Answer = sequelize.define<AnswerInstance>("Answer", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  roundId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
