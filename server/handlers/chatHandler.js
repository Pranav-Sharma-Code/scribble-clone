import roomManager from "../managers/RoomManager.js";

const chatHandler = (io, socket) => {

    // ---------------- CHAT MESSAGE ----------------

    socket.on("chat", ({ roomCode, text }) => {
        const room = roomManager.getRoom(roomCode);
        if (!room) return;

        const player = room.getPlayer(socket.id);
        if (!player) return;

        const message = text?.trim();
        if (!message) return;

        if (message.length > 150) return;

        const chatMessage = {
            id: crypto.randomUUID(),
            playerId: player.id,
            playerName: player.name,
            text: message
        }

        room.chatManager.addMessage(chatMessage);
        io.to(roomCode).emit("chat_message", chatMessage);
    });
};

export default chatHandler;