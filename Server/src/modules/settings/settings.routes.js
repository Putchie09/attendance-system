import { Router } from "express";
import { getCurrentTheme, setTheme } from "./settings.controller.js";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/theme", getCurrentTheme);

router.put("/theme", verifyToken, requireAdmin, setTheme);

export default router;
