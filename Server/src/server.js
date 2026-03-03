import dontenv from "dotenv";
import app from "./app.js";

dontenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});