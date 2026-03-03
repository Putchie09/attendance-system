import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getCurrentThemeService, setThemeService } from "./settings.service.js";

export const getCurrentTheme = asyncHandler(async (req, res) => {
  const theme = await getCurrentThemeService();
  res.json({ theme });
});

export const setTheme = asyncHandler(async (req, res) => {
  await setThemeService(req.body.theme);
  res.json({ message: "Theme updated" });
});
