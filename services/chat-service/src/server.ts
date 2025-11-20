import express from "express";
import http from "http";
import createSocket from "./socket";
import cors from "cors";
import chatRouter from "./controllers/chat.controller";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRouter);

createSocket(server);

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => console.log(`Chat service listening on ${PORT}`));
