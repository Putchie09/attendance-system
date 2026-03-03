import { getServerTime } from "./time.repository.js";

export async function getCurrentServerTime(req, res) {
  try {
    const serverTime = await getServerTime();
    res.json({ serverTime });
  } catch (error) {
    console.error("Error getting server time:", error);
    res.status(500).json({ error: "Error getting server time" });
  }
}
