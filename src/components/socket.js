import io from "socket.io-client";

const socket = io.connect("https://adventure-clicker-backend.onrender.com", {
  withCredentials: true,
});

export default socket;
