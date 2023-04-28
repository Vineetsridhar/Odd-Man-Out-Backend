import express from "express";
import {
  createGameRoom,
  getRooms,
  joinGameRoom,
  getRoom,
  joinGameRoomCookie,
  leaveGameRoom,
} from "../controllers/roomController";

const router = express.Router();

router.get("/", getRooms);
router.post("/", createGameRoom);
router.delete("/", leaveGameRoom);
router.post("/join", joinGameRoom);
router.get("/join", joinGameRoomCookie);
router.get("/:roomCode", getRoom);

export default router;
