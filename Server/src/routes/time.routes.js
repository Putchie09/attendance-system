import { Router } from "express";
const router = Router();
import { getCurrentServerTime } from "../controllers/time.controller.js";

router.get("/", getCurrentServerTime);

export default router;
