import {
  DataTypes,
  IntegerDataType,
  Model,
  Optional,
  Sequelize,
  SmallIntegerDataType,
  UUIDV1,
} from "sequelize";
import { sequelize } from "../database/database";
import { RoomInstance } from "./Room";
import { UserInstance } from "./User";

type RoundStatus = "answering" | "voting";
type RoundAttributes = {
  id: string;
  roundNumber: number;
  oddManOutId: string;
  mainQuestion: string;
  oddManOutQuestion: string;
  status: RoundStatus;
  roomId: string;
};

type RoundCreationAttributes = Optional<RoundAttributes, "id">;

export interface RoundInstance
  extends Model<RoundAttributes, RoundCreationAttributes>,
    RoundAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  oddManOut?: UserInstance;
  room?: RoomInstance;
}

export const Round = sequelize.define<RoundInstance>("Round", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  roundNumber: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  oddManOutId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  mainQuestion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  oddManOutQuestion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
