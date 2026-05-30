import roomManager from "../managers/RoomManager.js";
import Player from "../models/Player.js";
import generateRoomCode from "../utils/generateRoomCode.js";

const roomHandler = (io, socket) => {

    //----------Create Room------------

    socket.on("create_room", ({ playerName, settings }, callback) => {

        const roomCode = generateRoomCode();
        const room = roomManager.createRoom(roomCode, socket.id, settings);
        const player = new Player(socket.id, playerName);

        room.addPlayer(player);
        room.settings = { ...room.settings, ...settings };
        socket.join(roomCode);

        callback({
            success: true,
            roomCode,
        });

        io.to(roomCode).emit(
            "player_list_update",
            {
                players: room.players,
                hostId: room.hostId,
            }
        );
    });

    //---------Join Room----------


    socket.on("join_room", ({ roomCode, playerName }, callback) => {

        const room = roomManager.getRoom(roomCode);
        const player = new Player(socket.id, playerName);

        if (!room) {
            return callback({
                success: false,
                message: "Room not found",
            });
        }

        if (room.gameStarted) {
            return callback({
                success: false,
                message: "Game already started",
            });
        }

        if (room.players.length >= room.settings.maxPlayers) {
            return callback({
                success: false,
                message: "Room is full",
            });
        }

        const existingPlayer = room.players.find(player => player.id === socket.id);

        if (existingPlayer) {
            return callback({
                success: true
            });
        }
        room.addPlayer(player);
        socket.join(roomCode);

        callback({ success: true });

        socket.emit("canvas_state", room.canvasStrokes);

        io.to(roomCode).emit("player_list_update",
            {
                players: room.players,
                hostId: room.hostId,
            }
        );
    }
    );

    // ---GET_ROOM-----

    socket.on("get_room", ({ roomCode }, callback) => {

        const room = roomManager.getRoom(roomCode);

        if (!room) {
            return callback({
                success: false,
                message: "Room not found",
            });
        }

        callback({
            success: true,
            players: room.players,
            hostId: room.hostId,
            settings: room.settings,
            roomCode: room.roomCode,
        });

    });

    // ----------Disconnect-----------

    socket.on("disconnect", () => {

        roomManager.rooms.forEach((room, roomCode) => {

            const player = room.getPlayer(socket.id);

            if (!player) return;

            room.removePlayer(socket.id);

            if (room.hostId == socket.id && room.players.length > 0) {

                room.hostId = room.players[0].id;
                io.to(roomCode).emit("new_host", room.hostId);
            }

            io.to(roomCode).emit("player_left", player);

            io.to(roomCode).emit("player_list_update", {
                players: room.players,
                hostId: room.hostId
            });

            if(socket.id === room.gameManager.currentDrawerId){
                room.gameManager.nextTurn(io);
            }

            if (room.gameStarted && room.players.length < 2) {
                room.gameManager.endGame(io);
            }

            if (room.isEmpty()) {
                roomManager.deleteRoom(roomCode);
            }
        });
        console.log("USER DISCONNECTED:", socket.id);
    });
}

export default roomHandler;