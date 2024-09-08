import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
axios.defaults.withCredentials = true;

import Game from "./components/Game";
import Logout from "./components/Logout";
import Login from "./components/Login";
import CircularLoadingBar from "./components/CircularLoadingBar";

const PORT = 3001;

const GameScreen = () => {
  const [authUserId, setAuthUserId] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");

  const checkGame = async () => {
    try {
      const response = await axios.get(`https://adventure-clicker-backend.onrender.com`);

      // Erfolgreiche Authentifizierung
      setAuthUserId(response.data.user._id);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Redirecting to login page");
        window.location.href = "https://adventure-clicker.netlify.app/login";
      } else {
        console.error("Login failed:", error);
      }
    }
  };

  useEffect(() => {
    checkGame();
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.post(
          `https://adventure-clicker-backend.onrender.com/graphql`,
          {
            query: `
              query {
                getUserByAuth(authUserId: "${authUserId}") {
                  id
                  name
                }
              }
            `,
          },
          { withCredentials: true }
        );

        setUserId(response.data.data.getUserByAuth.id);
        setName(response.data.data.getUserByAuth.name);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Redirecting to login page");
          window.location.href = "https://adventure-clicker.netlify.app/login";
        } else {
          console.error("Error retrieving user data:", error);
        }
      }
    };


    if (authUserId) {
      console.log("authUserId", authUserId);
      getUserId();
    }
  }, [authUserId]);

  return (
    <div>
      {userId ? <Game userId={userId} name={name} /> : <CircularLoadingBar />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
