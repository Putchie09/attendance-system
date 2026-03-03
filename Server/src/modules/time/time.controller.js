import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getServerTime } from "./time.repository.js";

export const getCurrentServerTime = asyncHandler(async (req, res) => {
  const serverTime = await getServerTime();
  res.json({ serverTime });
});
