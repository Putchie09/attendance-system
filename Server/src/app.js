import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import timeRoutes from "./routes/time.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/time", timeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
