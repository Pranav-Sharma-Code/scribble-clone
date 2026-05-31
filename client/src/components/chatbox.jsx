import React, { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

const ChatBox = ({ roomCode }) => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const handleChatMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    const handleGuessCorrect = (data) => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        type: "system",
        text: `${data.playerName} guessed the word! (+${data.scoreEarned})`
      }]);
    };

    socket.on("chat_message", handleChatMessage);
    socket.on("guess_correct", handleGuessCorrect);

    return () => {
      socket.off("chat_message", handleChatMessage);
      socket.off("guess_correct", handleGuessCorrect);
    };

  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat", {
      roomCode,
      text: message
    });

    setMessage("");
  };

  return (

    <div className="w-full h-full bg-black/30 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col">

      <div className="p-3 border-b border-white/10 flex justify-center">
        <h2 className="text-white font-black text-lg">
          CHAT
        </h2>
      </div>

      {/* ------- Messages --------- */}

      <div
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2">

        {
          messages.length === 0 && (
            <div className="h-full flex justify-center items-center text-white/40 text-sm">
              No messages yet...
            </div>
          )
        }

        {
          messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id}
                  className=" text-center text-yellow-300 text-xs font-bold">
                  {msg.text}
                </div>
              );
            }

            return (
              <div key={msg.id}
                className="bg-white/10 rounded-xl p-2 break-all">

                <p className="text-cyan-300 font-bold text-sm">
                  {msg.playerName}
                </p>

                <p className="text-white text-sm whitespace-pre-wrap break-all">
                  {msg.text}
                </p>
              </div>
            );
          })
        }

        <div ref={bottomRef}></div>

      </div>

      <div className="border-t border-white/10 p-2">
        <input value={message} maxLength={150}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type & press Enter..."
          className="w-full bg-white rounded-xl px-3 py-2 outline-none text-sm" />
      </div>

    </div>
  );
};

export default ChatBox;