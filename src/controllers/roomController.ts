import { generateRandomString } from "../helpers";
import { Room } from "../models/Room";
import { User } from "../models/User";

export const getRooms = async (_, response) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    response.json({ rooms });
  } catch (error) {
    console.error("Error getting rooms:", error);
    response.status(500).json({ error: "Error getting rooms" });
  }
};

export const getRoom = async (request, response) => {
  try {
    const { roomCode } = request.params;
    const room = await Room.findOne({
      where: { roomCode },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    response.json({ room });
  } catch (error) {
    console.error("Error getting room:", error);
    response.status(500).json({ error: "Error getting room" });
  }
};

export const createGameRoom = async (request, response) => {
  try {
    const { nickname } = request.body;
    if (!nickname) {
      return response.status(400).json({ error: "Missing nickname" });
    }

    const roomCode = generateRandomString();
    const room = await Room.create({ roomCode, gameType: "classic" });
    const user = await User.create({
      nickname,
      isHost: true,
      points: 0,
      roomId: room.id,
      sessionId: request.sessionID,
    });

    response.json({ room, user });
  } catch (error) {
    console.error("Error creating game room:", error);
    response
      .status(500)
      .json({ error: "There was an error when creating your room" });
  }
};

export const joinGameRoom = async (request, response) => {
  try {
    const { nickname, roomCode } = request.body;
    if (!nickname || !roomCode) {
      return response
        .status(400)
        .json({ error: "Missing nickname or roomCode" });
    }

    const room = await Room.findOne({
      where: {
        roomCode,
      },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    if (!room) {
      return response.status(404).json({ error: "Room not found" });
    }
    if (room.users.length >= 10) {
      return response.status(400).json({ error: "Game is full" });
    }
    if (room.users.find((user) => user.nickname === nickname)) {
      return response.status(400).json({ error: "Nickname already taken" });
    }
    if (room.gameEndedAt) {
      return response.status(400).json({ error: "Game has ended" });
    }

    const user = await User.create({
      nickname,
      isHost: false,
      points: 0,
      roomId: room.id,
      sessionId: request.sessionID,
    });
    room.users.push(user);

    response.json({ room, user });
  } catch (error) {
    console.error("Error joining game room:", error);
    response
      .status(500)
      .json({ error: "There was an error when trying to join the room" });
  }
};
