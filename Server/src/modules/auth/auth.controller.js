import { asyncHandler } from "../../middleware/asyncHandler.js";
import { loginAdmin } from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const { token, user } = await loginAdmin(username, password);

  res.status(200).json({ token, user });
});
