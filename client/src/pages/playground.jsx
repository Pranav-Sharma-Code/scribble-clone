import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DrawBoard from '../components/drawBoard';
import ChatBox from '../components/chatbox';
import PlayerList from '../components/playerlist';
import socket from '../socket/socket';

const Playground = () => {

  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [hostId, setHostId] = useState("");
  const [drawerId, setDrawerId] = useState("");

  useEffect(() => {
    const handleGameState = (gameState) => {
      setDrawerId(gameState.drawerId);
    };

    const handleLeaderboardUpdate = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    const handlePlayerListUpdate = (data) => {
      setPlayers(data.players || []);
      setHostId(data.hostId || "");
    };

    socket.on("game_state", handleGameState);
    socket.on("leaderboard_update", handleLeaderboardUpdate);
    socket.on("player_list_update", handlePlayerListUpdate);

    return () => {
      socket.off("game_state", handleGameState);
      socket.off("leaderboard_update", handleLeaderboardUpdate);
      socket.off("player_list_update", handlePlayerListUpdate);
    };
  }, []);

  useEffect(() => {
    socket.emit("get_room", { roomCode }, (response) => {
      if (response.success) {
        setPlayers(response.players);
        setHostId(response.hostId);
      }
    });
  }, [roomCode]);

  return (
    <div className="flex flex-col lg:flex-row justify-evenly items-center gap-2 min-h-screen w-full p-2 md:p-4">

      <div className="w-full lg:w-52 xl:w-64 h-auto lg:h-[600px] order-1 lg:order-1">
        <PlayerList
          players={players}
          hostId={hostId}
          drawerId={drawerId}
        />
      </div>

      <div className="flex-1 min-w-0 max-w-[700px] order-2">
        <DrawBoard />
      </div>

      <div className="w-full lg:w-64 xl:w-72 h-[300px] lg:h-[600px] order-3">
        <ChatBox roomCode={roomCode} />
      </div>

    </div>
  );
};

export default Playground;