import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import GameManager from './managers/GameManager.js';
import gameHandler from './handlers/gameHandler.js';

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

const gameManager = new GameManager(io);


io.on("connection", (socket) => {
    console.log("USER CONNECTED:", socket.id);

    gameHandler(socket, gameManager);

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
    });
});

server.listen(3001, ()=>{
    console.log("SERVER RUNNING ON 3001");
})