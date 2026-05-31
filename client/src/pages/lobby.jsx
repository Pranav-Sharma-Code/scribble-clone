import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket/socket";
import toast from "react-hot-toast";

const Lobby = () => {

    const navigate = useNavigate();
    const { roomCode } = useParams();
    const [players, setPlayers] = useState([]);
    const [hostId, setHostId] = useState("");

    useEffect(() => {
        const handlePlayerListUpdate = ({ players, hostId }) => {
            setPlayers(players);
            setHostId(hostId);
        };
        const handleGameStarted = () => {
            navigate(`/playground/${roomCode}`);
        };
        const handleGameError = (message) => {
            alert(message);
        };
        const handleNewHost = (newHostId) => {
            setHostId(newHostId);
        };

        socket.on("player_list_update", handlePlayerListUpdate);
        socket.on("game_started", handleGameStarted);
        socket.on("game_error", handleGameError);
        socket.on("new_host", handleNewHost);

        return () => {
            socket.off("player_list_update", handlePlayerListUpdate);
            socket.off("game_started", handleGameStarted);
            socket.off("game_error", handleGameError);
            socket.off("new_host", handleNewHost);
        };

    }, [navigate, roomCode]);

    useEffect(() => {
        const playerName = localStorage.getItem("name")?.trim() || "Player";
        const emoji_array = ['🙂', '😎', '💀', '😁', '😡', '🫣', '🌚', '😋', '😉', '😍', '🫡', '😪', '😌', '🥸', '🤠', '🤡', '😇', '🤖', '👾', '👽', '👻', '🦁', '🦊'];
        const avatar = emoji_array[Number(localStorage.getItem("emojiIndex")) || 0] || '😀';

        socket.emit("join_room", { roomCode, playerName, avatar }, (response) => {
            if (!response.success) {
                alert(response.message || "Failed to join room");
                return;
            }
            socket.emit("get_room", { roomCode }, (res) => {
                if (res.success) {
                    setPlayers(res.players);
                    setHostId(res.hostId);
                }
            });
        });
    }, [roomCode]);

    const startGame = () => {
        socket.emit("start_game", { roomCode });
    };


    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4'>

            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl">

                <h1 className="text-4xl font-black text-center mb-8">
                    Lobby
                </h1>



                <div className="bg-purple-100 rounded-2xl p-4 mb-8 shadow-md hover:shadow-lg transition-all duration-300">

                    <div className="flex justify-between items-center">

                        <div>
                            <h2 className="font-bold text-lg text-purple-900">
                                Room Code
                            </h2>

                            <span className="text-3xl font-black tracking-widest text-purple-700">
                                {roomCode}
                            </span>
                        </div>

                        <button
                            onClick={() => { navigator.clipboard.writeText(roomCode); toast.success("Room code copied!"); }}
                            className="group bg-purple-600 hover:bg-purple-700 active:scale-90 transition-all duration-200 px-4 py-3 rounded-xl shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-white transition-all duration-300">
                                content_copy
                            </span>
                        </button>

                    </div>

                </div>

                <div className="bg-purple-100 rounded-2xl p-4 mb-8 shadow-md hover:shadow-lg transition-all duration-300">

                    <div className="flex justify-between items-start gap-4">

                        <div className="flex-1">
                            <p className="font-bold text-lg text-purple-900">
                                Invite Link
                            </p>

                            <p className="text-blue-600 break-all text-lg font-bold">
                                {window.location.origin}/room/{roomCode}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `${window.location.origin}/room/${roomCode}`
                                );
                                toast.success("Invite link copied!");
                            }}
                            className="group bg-purple-600 hover:bg-purple-700 active:scale-90 transition-all duration-200 px-4 py-3 rounded-xl shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-white transition-all duration-300">
                                content_copy
                            </span>
                        </button>

                    </div>

                </div>

                {/* ----Players----- */}

                <div>

                    <h2 className="text-2xl font-black mb-4">
                        Players ({players.length})
                    </h2>

                    <div className="space-y-3">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className="bg-gray-100 p-4 rounded-2xl flex justify-between items-center"
                            >
                                <span className="font-bold text-xl">
                                    {player.name}
                                </span>
                                {player.id === hostId && (
                                    <span  className="text-yellow-500 text-2xl">
                                        HOST
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                <div className="flex justify-center mt-8">
                    {socket.id === hostId ? (
                        <button
                            onClick={startGame}
                            className="bg-green-600 text-white font-bold text-xl px-8 py-4 rounded-2xl hover:scale-95 transition-all"
                        >
                            Start Game
                        </button>

                    ) : (

                        <p className="font-bold text-xl text-gray-500">
                            Waiting for Host...
                        </p>

                    )}
                </div>
            </div>
        </div>
    );
};

export default Lobby;