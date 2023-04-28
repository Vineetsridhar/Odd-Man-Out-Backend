import express from "express";
import {
  createGameRoom,
  getRooms,
  joinGameRoom,
  getRoom,
  joinGameRoomCookie,
} from "../controllers/roomController";

const router = express.Router();

router.get("/", getRooms);
router.post("/", createGameRoom);
router.post("/join", joinGameRoom);
router.get("/join", joinGameRoomCookie);
router.get("/:roomCode", getRoom);

export default router;
