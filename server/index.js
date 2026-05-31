import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import socketHandler from "./socket/socketHandler.js";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Scribble Backend Running");
});

const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    socketHandler(io, socket);
});
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON ${PORT}`);
});