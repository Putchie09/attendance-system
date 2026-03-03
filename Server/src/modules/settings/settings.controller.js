import { getTheme, updateTheme } from "../models/settings.repository.js";

const allowedThemes = ["purple", "blue", "green", "orange", "rose"];

export async function getCurrentTheme(req, res) {
  try {
    const theme = await getTheme();

    if (!theme) {
      return res.status(404).json({ error: "Theme not configured" });
    }

    res.json({ theme });
  } catch (error) {
    console.error("Error getting theme:", error);
    res.status(500).json({ error: "Error getting theme" });
  }
}

export async function setTheme(req, res) {
  try {
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({ error: "Theme is required" });
    }

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({ error: "Invalid theme" });
    }

    const affectedRows = await updateTheme(theme);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Theme not found" });
    }

    res.json({ message: "Theme updated" });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).json({ error: "Error updating theme" });
  }
}
