import roomManager from "../managers/RoomManager.js";
import Player from "../models/Player.js";
import generateRoomCode from "../utils/generateRoomCode.js";

const roomHandler = (io, socket) => {

    //----------Create Room------------

    socket.on("create_room", ({ playerName, settings, avatar }, callback) => {

        const roomCode = generateRoomCode();
        const room = roomManager.createRoom(roomCode, socket.id, settings);
        const player = new Player(socket.id, playerName, avatar);

        room.addPlayer(player);
        room.settings = { ...room.settings, ...settings };
        socket.join(roomCode);

        callback({
            success: true,
            roomCode,
        });

        io.to(roomCode).emit("player_list_update",
            {
                players: room.players,
                hostId: room.hostId,
            }
        );
    });

    //---------Join Room----------


    socket.on("join_room", ({ roomCode, playerName, avatar }, callback) => {

        const room = roomManager.getRoom(roomCode);

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

        const player = new Player(socket.id, playerName, avatar);
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
        io.to(roomCode).emit("chat_message",
            {
                id: crypto.randomUUID(),
                type: "system",
                text: `${player.name} joined the room`
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

    // ----------Quick Play----------

    socket.on("quick_play", ({ playerName, emojiIndex }) => {
        const emoji_array = [
            '🙂', '😎', '💀', '😁', '😡', '🫣', '🌚', '😋', '😉',
            '😍', '🫡', '😪', '😌', '🥸', '🤠', '🤡', '😇',
            '🤖', '👾', '👽', '👻', '🦁', '🦊'
        ];
        const avatar = emoji_array[emojiIndex] || '😀';

        let targetRoom = null;
        let targetCode = null;

        for (const [code, room] of roomManager.rooms) {
            if (!room.gameStarted && room.players.length < room.settings.maxPlayers) {
                targetRoom = room;
                targetCode = code;
                break;
            }
        }

        if (!targetRoom) {
            targetCode = generateRoomCode();
            targetRoom = roomManager.createRoom(targetCode, socket.id, {});
        }

        const existingPlayer = targetRoom.players.find(
            player => player.id === socket.id
        );

        if (!existingPlayer) {
            const player = new Player(socket.id, playerName, avatar);
            targetRoom.addPlayer(player);
        }
        
        socket.join(targetCode);
        socket.emit("quick_play_joined", { roomCode: targetCode });

        io.to(targetCode).emit("player_list_update", {
            players: targetRoom.players,
            hostId: targetRoom.hostId,
        });
    });

    // ----------Disconnect-----------

    socket.on("disconnect", () => {

        roomManager.rooms.forEach((room, roomCode) => {

            const player = room.getPlayer(socket.id);

            if (!player) return;

            const wasDrawer = room.gameStarted && socket.id === room.gameManager.currentDrawerId;

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
            io.to(roomCode).emit("chat_message",
                {
                    id: crypto.randomUUID(),
                    type: "system",
                    text: `${player.name} left the room`
                }
            );

            if (room.isEmpty()) {
                room.gameManager.reset();
                roomManager.deleteRoom(roomCode);
                return;
            }

            if (room.gameStarted && room.players.length < 2) {
                room.gameManager.endGame(io);
            } else if (wasDrawer) {
                room.gameManager.nextTurn(io);
            }
        });
    });


}

export default roomHandler;