import express from "express";
import { Room } from "../models/Room";

export const startGame = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { data } = request.cookies;

    const { roomCode } = data;

    const room = await Room.findOne({
      where: { roomCode },
    });

    if (room.gameStartedAt) {
      return response.status(400).json({ error: "Game already started" });
    }

    room.update({ gameStartedAt: new Date() });

    const io = request.app.get("socketio");
    io.in(roomCode).emit("game-started");

    response.json({ room });
  } catch (error) {
    console.error("Error starting game:", error);
    response.status(500).json({ error: "Error starting game" });
  }
};
