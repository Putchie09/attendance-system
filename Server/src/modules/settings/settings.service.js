import { getTheme, updateTheme } from "./settings.repository.js";
import { AppError } from "../../middleware/AppError.js";

const allowedThemes = ["purple", "blue", "green", "orange", "rose"];

export const getCurrentThemeService = async () => {
  const theme = await getTheme();

  if (!theme) {
    throw new AppError("Theme not configured", 404);
  }

  return theme;
};

export const setThemeService = async (theme) => {
  if (!theme) {
    throw new AppError("Theme is required", 400);
  }

  if (!allowedThemes.includes(theme)) {
    throw new AppError("Invalid theme", 400);
  }

  const affectedRows = await updateTheme(theme);

  if (affectedRows === 0) {
    throw new AppError("Theme not found", 404);
  }
};
