import express from "express";
import {
  createGameRoom,
  getRooms,
  joinGameRoom,
  getRoom,
} from "../controllers/roomController";

const router = express.Router();

router.get("/", getRooms);
router.get("/:roomCode", getRoom);
router.post("/", createGameRoom);
router.post("/join", joinGameRoom);

export default router;
