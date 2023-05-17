import { DataTypes, Model, Optional, UUIDV1 } from "sequelize";
import { sequelize } from "../database/database";
import { RoomInstance } from "./Room";
import { RoundInstance } from "./Round";
import { UserInstance } from "./User";

type VoteAttributes = {
  id: string;
  votedId: string;
  voterId: string;
  roundId: string;
  roomId: string;
};

type VoteCreationAttributes = Optional<VoteAttributes, "id">;

export interface VoteInstance
  extends Model<VoteAttributes, VoteCreationAttributes>,
    VoteAttributes {
  createdAt?: Date;
  voter?: UserInstance;
  voted?: UserInstance;
  round?: RoundInstance;
  room?: RoomInstance;
}

export const Vote = sequelize.define<VoteInstance>("Vote", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  votedId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  voterId: {
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
