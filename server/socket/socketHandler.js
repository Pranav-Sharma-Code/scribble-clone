import roomHandler from "../handlers/roomHandler.js";
import gameHandler from "../handlers/gameHandler.js";
import drawingHandler from "../handlers/drawingHandler.js";

const socketHandler = (io, socket) => {

    console.log("USER CONNECTED:", socket.id);

    roomHandler(io, socket);
    gameHandler(io, socket);
    drawingHandler(io, socket);

};

export default socketHandler;