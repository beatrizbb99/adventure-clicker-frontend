import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import React from "react";

import Chat from "./Chat";
import Adventure from "./Adventure";
import GameStartComponent from "./GameStartComponent";
import UserStats from "./UserStats";
import ItemList from "./ItemList";
import Equip from "./Equip";
import CreateGuild from "./CreateGuild";
import JoinGuild from "./JoinGuild";

import socket from "./socket";
import Header from "./Header";

const Game = (props) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [activeChat, setActiveChat] = useState("global");
  const userId = props.userId;
  const name = props.name;

  useEffect(() => {
    //console.log(userId);
  }, [userId]);

  const toggleChat = (chatId) => {
    setActiveChat(chatId);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const joinUserUpdate = () => {
    socket.emit("joinUserUpdate", { userid: userId });
    // console.log('joining userupdate');
  };

  joinUserUpdate();

  return (
    <React.Fragment>
      {gameStarted ? (
        <Adventure userId={userId} />
      ) : (
        <GameStartComponent onStartGame={handleStartGame} />
      )}
      <Header userId={userId} name={name}/>
      <UserStats userId={userId} />
      <Equip userId={userId} />
      {/*
      <div className="stats">
        <UserStats userId={userId}></UserStats>
      </div>
      <div className="whole-chat">
        <div className="chat-buttons">
          <a
            onClick={() => toggleChat("global")}
            className={
              activeChat === "global"
                ? "active-link chat-tab-button"
                : "chat-tab-button"
            }
          >
            Global Chat
          </a>
          <a
            onClick={() => toggleChat("guild")}
            className={
              activeChat === "guild"
                ? "active-link chat-tab-button"
                : "chat-tab-button"
            }
          >
            Guild Chat
          </a>
        </div>

        <div
          className={`chat ${activeChat === "global" ? "chat-shown" : "chat-hidden"
            }`}
        >
          <Chat
            userId={userId}
            name={name}
            guildId="65a46184c9cd9e13114ae074"
          ></Chat>
        </div>
        <div
          className={`chat ${activeChat === "guild" ? "chat-shown" : "chat-hidden"
            }`}
        >
          <Chat
            userId={userId}
            name={name}
            guildId="65a59bcced028d1fec6239b7"
          ></Chat>
        </div>
      </div>

      <div className="inventory">
        <ItemList userId={userId}></ItemList>
      </div>
      <div>
        <Equip userid={userId}></Equip>
      </div>
      <div>
        <CreateGuild creatorId={userId} />
      </div>
      <div>
        <JoinGuild userId={userId} />
      </div>
          */}
    </React.Fragment>
  );
};

Game.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Game;
