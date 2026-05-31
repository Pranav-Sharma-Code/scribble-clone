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
      console.log("LEADERBOARD UPDATE", updatedPlayers);
      setPlayers(updatedPlayers);
    };

    const handlePlayerListUpdate = (data) => {
      console.log("PLAYER LIST UPDATE", data);
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
    <div className="flex justify-center items-center gap-2 h-screen p-4">
      <div className="w-72 h-[600px]">
        <PlayerList
          players={players}
          hostId={hostId}
          drawerId={drawerId}
        />
      </div>

      <DrawBoard />

      <div className="w-80 h-[600px]">
        <ChatBox roomCode={roomCode} />
      </div>

    </div>
  );
};

export default Playground;