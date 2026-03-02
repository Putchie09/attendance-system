import { Router } from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import { generateToken } from "../utils/jwt.js";
import { verifyAdminToken } from "../middlewares/verifyAdminToken.middleware.js";

const router = Router();

router.post("/login", authenticateAdmin, (req, res) => {
  const token = generateToken({
    id: req.user.id,
    username: req.user.username,
    role_id: req.user.role_id,
  });

  res.json({ token });
});

/* Ruta protegida de prueba */
router.get("/dashboard", verifyAdminToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
