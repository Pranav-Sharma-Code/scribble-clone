import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import socketHandler from "./socket/socketHandler.js";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})



io.on("connection", (socket) => {
    console.log("USER CONNECTED:", socket.id);
    socketHandler(io, socket);
});

server.listen(3001, () => {
    console.log("SERVER RUNNING ON 3001");
});
