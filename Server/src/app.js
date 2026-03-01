import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import timeRoutes from './routes/time.routes.js';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use("/api/attendance", attendanceRoutes);
//utils
app.use("/api/server-time", timeRoutes);


app.get('/', (req, res) => {
  res.json({ message: "API running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});