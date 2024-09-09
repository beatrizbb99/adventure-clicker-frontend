import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const Home = (PORT) => {
  const [message, setMessage] = useState('');
  const socket = io("https://adventure-clicker-backend.onrender.com", {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Hier wird der Token hinzugefügt
    },
    transports: ["websocket", "polling"], // Optional: Fallback auf "polling"
  });

  socket.on("connect_error", () => {
    console.log("Fehler bei der Verbindung, versuche erneut zu verbinden...");
    socket.io.opts.transports = ["polling", "websocket"];
    socket.connect();
  });
  
  
  useEffect(() => {
    const guildId = 'exampleGuildId';
    socket.emit('joinGuildChat', guildId);

    socket.on('chatMessage', (data) => {
      console.log('Received chat message:', data);
    });

    const userId = 'exampleUserId';
    socket.emit('joinUserUpdate', userId);

    socket.on('updatedUser', (updatedUserId) => {
      console.log('User updated:', updatedUserId);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSendMessage = async () => {
    const guildId = 'exampleGuildId';
    socket.emit('chatMessage', { guildId, message });
  };

  return (
    <div>
      <h2>Home Page</h2>
      <Link to="/logout">Logout</Link>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default Home;
