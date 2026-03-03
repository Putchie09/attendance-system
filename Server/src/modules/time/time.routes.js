import { Router } from "express";
import { getCurrentServerTime } from "./time.controller.js";

const router = Router();

router.get("/", getCurrentServerTime);

export default router;
