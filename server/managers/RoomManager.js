import Room from "../models/Room.js";

class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(roomCode, hostId){
        const room = new Room(roomCode, hostId);
        this.rooms.set(roomCode, room);

        return room;
    }

    getRoom(roomCode){
        return this.rooms.get(roomCode);
    }

    deleteRoom(roomCode){
        this.rooms.delete(roomCode);
    }
}

export default new RoomManager();