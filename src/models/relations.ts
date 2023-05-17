import { Answer } from "./Answer";
import { Room } from "./Room";
import { Round } from "./Round";
import { User } from "./User";
import { Vote } from "./Vote";

export function setUpRelationships() {
  Room.hasMany(Round, {
    sourceKey: "id",
    foreignKey: "roomId",
    as: "rounds",
  });
  Round.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
  });

  Room.hasMany(User, {
    sourceKey: "id",
    foreignKey: "roomId",
    as: "users",
  });
  User.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
  });

  Answer.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
  });

  Vote.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
  });

  Round.hasMany(Answer, {
    sourceKey: "id",
    foreignKey: "roundId",
    as: "answers",
  });
  Answer.belongsTo(Round, {
    foreignKey: "roundId",
    as: "round",
  });

  Round.hasMany(Vote, {
    sourceKey: "id",
    foreignKey: "roundId",
    as: "votes",
  });
  Vote.belongsTo(Round, {
    foreignKey: "roundId",
    as: "round",
  });

  Round.belongsTo(User, {
    foreignKey: "oddManOutId",
    as: "oddManOut",
  });

  Answer.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(Vote, {
    foreignKey: "votedId",
    as: "votes",
  });
  User.hasOne(Vote, {
    foreignKey: "voterId",
    as: "vote",
  });
  Vote.belongsTo(User, {
    foreignKey: "voterId",
    as: "voter",
  });
}
