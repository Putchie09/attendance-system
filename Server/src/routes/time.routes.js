import { Router } from "express";
import { getCurrentServerTime } from "../controllers/time.controller.js";

const router = Router();

router.get("/", getCurrentServerTime);

export default router;
