import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import axios from "axios";
axios.defaults.withCredentials = true;

const Chat = ({ userId, name, guildId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io.connect("https://adventure-clicker-backend.onrender.com", {
      withCredentials: true,
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const joinGuildChat = (guildChatName) => {
    socketRef.current.emit("joinGuildChat", {
      username: name,
      userGuild: guildChatName,
    });
  };

  useEffect(() => {
    joinGuildChat(guildId);

    socketRef.current.on("newMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, text: data.message },
      ]);
    });

    return () => { };
  }, [guildId]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const response = await axios.post("https://adventure-clicker-backend.onrender.com/graphql", {
          query: `
            query {
              getAllChatsAfterTime(timestamp: "${threeDaysAgo.toISOString()}", gildenId:"${guildId}") {
                userId
                username
                text
              }
            }
          `,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          }
        });

        setMessages(response.data.data.getAllChatsAfterTime);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [guildId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      // Direkt die Nachricht lokal anzeigen
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: name, text: newMessage },
      ]);

      try {
        await fetchChatToDB();
        socketRef.current.emit("chatMessage", {
          userGuild: guildId,
          username: name,
          message: newMessage,
        });
      } catch (error) {
        console.error("Error sending chat message:", error);
      }

      setNewMessage("");
    }
  };

  const fetchChatToDB = async () => {
    try {
      await axios.post("https://adventure-clicker-backend.onrender.com/graphql", {
        query: `
          mutation {
            createChat(text: "${newMessage}", userId: "${userId}", username:"${name}", gildenId: "${guildId}") {
              userId
            }
          }
        `,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        }
      });
    } catch (error) {
      console.error("Error storing chat message:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chat-panel">
      <div className="chat-display">
        <ul>
          {messages
            .slice()
            .reverse()
            .map((message, index) => (
              <li className="chat-messages" key={index}>
                {message.username}: {message.text}
              </li>
            ))}
        </ul>
      </div>
      <form className="chat-input-container" onSubmit={handleFormSubmit}>
        <input
          className="chat-input-bar"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="chat-input-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

Chat.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  guildId: PropTypes.string.isRequired,
};

export default Chat;
