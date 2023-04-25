import express from "express";
import {
  createGameSession,
  getSessions,
  joinGameSession,
} from "../controllers/sessionController";

const router = express.Router();

router.get("/", getSessions);
router.post("/", createGameSession);
router.post("/join", joinGameSession);

export default router;
