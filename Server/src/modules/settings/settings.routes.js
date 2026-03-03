import { Router } from "express";
import {
  getCurrentTheme,
  setTheme,
} from "./settings.controller.js";

// when we have auth
// import { verifyToken } from "../middlewares/auth.middleware.js";
// import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/theme", getCurrentTheme);

// protect routes like this when we have auth:
router.put(
  "/theme",
  // verifyToken,
  // requireAdmin,
  setTheme,
);

export default router;
