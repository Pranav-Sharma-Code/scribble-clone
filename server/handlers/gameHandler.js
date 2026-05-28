const gameHandler = (socket, gamemanager) =>{
    socket.on("start-game", () => {
        gamemanager.startGame();
    });
};
export default gameHandler;