import express from "express";
import {
  createGameSession,
  getSessions,
  joinGameSession,
  getSession,
} from "../controllers/sessionController";

const router = express.Router();

router.get("/", getSessions);
router.get("/:roomCode", getSession);
router.post("/", createGameSession);
router.post("/join", joinGameSession);

export default router;
