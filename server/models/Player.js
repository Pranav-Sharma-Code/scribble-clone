export default class Player {
    constructor(socketId, name, avatar="😀"){
        this.id = socketId;
        this.name = name;
        this.score = 0;
        this.avatar = avatar;
        this.ready = false;
    }
}

