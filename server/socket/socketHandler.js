import roomHandler from "../handlers/roomHandler.js";
import gameHandler from "../handlers/gameHandler.js";
import drawingHandler from "../handlers/drawingHandler.js";
import chatHandler from "../handlers/chatHandler.js";

const socketHandler = (io, socket) => {
    roomHandler(io, socket);
    gameHandler(io, socket);
    drawingHandler(io, socket);
    chatHandler(io, socket);
};

export default socketHandler;