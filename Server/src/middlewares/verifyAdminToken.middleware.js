import { verifyToken } from "../utils/jwt.js";

const ADMIN_ROLE_ID = 1;

export const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    // verify that the user has admin role
    if (decoded.role_id !== ADMIN_ROLE_ID) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
