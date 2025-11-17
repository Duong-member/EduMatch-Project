import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`[User-Service]: Running at http://localhost:${port}`);
});
