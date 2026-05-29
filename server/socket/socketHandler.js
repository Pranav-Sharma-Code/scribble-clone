import roomHandler from "../handlers/roomHandler.js";
import gameHandler from "../handlers/gameHandler.js";

const socketHandler = (io, socket) => {

    console.log("USER CONNECTED:", socket.id);

    roomHandler(io, socket);
    gameHandler(io, socket);

};

export default socketHandler;