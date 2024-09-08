import io from "socket.io-client";

const socket = io.connect("https://adventure-clicker-backend.onrender.com", {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
