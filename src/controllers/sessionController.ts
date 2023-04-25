import { generateRandomString } from "../helpers";
import { Session } from "../models/Session";
import { User } from "../models/User";

export const getSessions = async (_, response) => {
  try {
    const sessions = await Session.findAll({
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    response.json({ sessions });
  } catch (error) {
    console.error("Error getting sessions:", error);
    response.status(500).json({ error: "Error getting sessions" });
  }
};

export const getSession = async (request, response) => {
  try {
    const { roomCode } = request.params;
    const session = await Session.findOne({
      where: { roomCode },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    response.json({ session });
  } catch (error) {
    console.error("Error getting session:", error);
    response.status(500).json({ error: "Error getting session" });
  }
};

export const createGameSession = async (request, response) => {
  try {
    console.log(request);
    const { nickname } = request.body;
    if (!nickname) {
      return response.status(400).json({ error: "Missing nickname" });
    }

    const roomCode = generateRandomString();
    const session = await Session.create({ roomCode, gameType: "classic" });
    const user = await User.create({
      nickname,
      isHost: true,
      points: 0,
      sessionId: session.id,
    });

    response.json({ session, user });
  } catch (error) {
    console.error("Error creating game session:", error);
    response
      .status(500)
      .json({ error: "There was an error when creating your room" });
  }
};

export const joinGameSession = async (request, response) => {
  try {
    const { nickname, roomCode } = request.body;
    if (!nickname || !roomCode) {
      return response
        .status(400)
        .json({ error: "Missing nickname or roomCode" });
    }

    const session = await Session.findOne({
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

    if (!session) {
      return response.status(404).json({ error: "Session not found" });
    }
    if (session.users.length >= 10) {
      return response.status(400).json({ error: "Game is full" });
    }
    if (session.users.find((user) => user.nickname === nickname)) {
      return response.status(400).json({ error: "Nickname already taken" });
    }

    const user = await User.create({
      nickname,
      isHost: false,
      points: 0,
      sessionId: session.id,
    });

    response.json({ session, user });
  } catch (error) {
    console.error("Error joining game session:", error);
    response
      .status(500)
      .json({ error: "There was an error when trying to join the room" });
  }
};
