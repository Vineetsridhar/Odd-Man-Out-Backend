import { generateRandomString } from "../helpers";
import { Room } from "../models/Room";
import { User } from "../models/User";
import express from "express";

export const getRooms = async (
  _: express.Request,
  response: express.Response
) => {
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

export const getRoom = async (
  request: express.Request,
  response: express.Response
) => {
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

export const createGameRoom = async (
  request: express.Request,
  response: express.Response
) => {
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
    });
    response.cookie(
      "data",
      { userId: user.id, roomCode },
      {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      }
    );

    response.json({ room, user });
  } catch (error) {
    console.error("Error creating game room:", error);
    response
      .status(500)
      .json({ error: "There was an error when creating your room" });
  }
};

export const joinGameRoom = async (
  request: express.Request,
  response: express.Response
) => {
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
    });
    room.users.push(user);

    response.cookie(
      "data",
      { userId: user.id, roomCode },
      {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      }
    );

    response.json({ room, user });
  } catch (error) {
    console.error("Error joining game room:", error);
    response
      .status(500)
      .json({ error: "There was an error when trying to join the room" });
  }
};

export const joinGameRoomCookie = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    if (!request.cookies.data) {
      return response.status(400).json({ error: "Missing cookie" });
    }
    const { data } = request.cookies;

    const { userId } = data;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    const room = await Room.findOne({
      where: {
        id: user.roomId,
      },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    if (!room) {
      return response.status(404).json({ error: "Room not found" });
    }

    if (room.gameEndedAt) {
      return response.status(400).json({ error: "Game has ended" });
    }

    response.json({ room, user });
  } catch (error) {
    console.error("Error joining game room:", error);
    response
      .status(500)
      .json({ error: "There was an error when trying to join the room" });
  }
};

const setGameHost = async (roomCode: string) => {
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

  const users = room.users;
  if (users.length === 0) {
    room.destroy();
    return false;
  }

  users[0].update({ isHost: true });
  return true;
};

export const leaveGameRoom = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { data } = request.cookies;
    const { userId } = data;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    await user.destroy();

    if (user.isHost) {
      await setGameHost(data.roomCode);
    }

    response.clearCookie("data");

    response.json({ success: true });
  } catch (error) {
    console.error("Error leaving game room:", error);
    response
      .status(500)
      .json({ error: "There was an error when trying to leave the room" });
  }
};
