import RoomManager from "../managers/RoomManager.js"

const drawingHandler = (io, socket) => {

    // -----------Draw Start---------

    socket.on("draw_start", ({
        roomCode, x, y,
        color, size
    }) => {
        const room = RoomManager.getRoom(roomCode);
        if (!room) return;
        if (!room.gameStarted || socket.id !== room.gameManager.currentDrawerId) return;
        const stroke = {
            id: crypto.randomUUID(),
            color, size,
            points: [{ x, y }]
        };
        socket.currentStrokeId = stroke.id;
        room.canvasStrokes.push(stroke);
        io.to(roomCode).emit("draw_start", stroke);
    });

    // -------------Draw Move-------------

    socket.on("draw_move", ({
        roomCode,
        x, y
    }) => {
        const room = RoomManager.getRoom(roomCode);
        if (!room) return;
        if (!room.gameStarted || socket.id !== room.gameManager.currentDrawerId) return;
        const stroke = room.canvasStrokes.find(
            s => s.id === socket.currentStrokeId
        );
        if (!stroke) return;
        stroke.points.push({ x, y });
        io.to(roomCode).emit("draw_move", {
            strokeId: stroke.id,
            x, y
        });
    });

    // -----------End Draw--------------

    socket.on("draw_end", () => {
        socket.currentStrokeId = null;
    });

    // ----------------Undo------------

    socket.on("draw_undo", ({ roomCode }) => {
        const room = RoomManager.getRoom(roomCode);
        if (!room) return;
        if (!room.gameStarted || socket.id !== room.gameManager.currentDrawerId) return;
        room.canvasStrokes.pop();
        io.to(roomCode).emit("draw_undo", room.canvasStrokes);
    });

    // ------------Reset---------------

    socket.on("canvas_clear", ({ roomCode }) => {
        const room = RoomManager.getRoom(roomCode);
        if (!room) return;
        if (!room.gameStarted || socket.id !== room.gameManager.currentDrawerId) return;
        room.canvasStrokes = [];
        io.to(roomCode).emit("canvas_clear");
    });

}

export default drawingHandler;
