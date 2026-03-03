import express from "express";
import cors from "cors";

import userRoutes from "./modules/users/user.routes.js";
import roleRoutes from "./modules/roles/role.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import timeRoutes from "./modules/time/time.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/time", timeRoutes);


app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

export default app;