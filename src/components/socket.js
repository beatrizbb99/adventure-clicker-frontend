// socket.js
import io from "socket.io-client";

const socket = io("https://adventure-clicker-backend.onrender.com", {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  }
});

export default socket;
