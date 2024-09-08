import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";  // Import für Toastify
import "react-toastify/dist/ReactToastify.css";          // Toastify CSS

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
      const response = await axios.get(
        `https://adventure-clicker-backend.onrender.com`
      );

      // If the response status is 200, it means the user is authenticated
      //console.log("Authentication response:", response);
      setAuthUserId(response.data.user._id);
      toast.success("Angemeldet als ", response.data.user.username);
    } catch (error) {
      // Check if it's a redirect
      if (
        error.response &&
        error.response.status === 302 &&
        error.response.headers.location
      ) {
        
        window.location.href = "https://adventure-clicker.netlify.app/login";
        toast.warn("Bitte melde dich an.");
      } else {
        console.error("Login failed:", error);
        toast.error("Login fehlgeschlagen.");
      }
    }
  };

  useEffect(() => {
    checkGame();
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
          query: `
                query {
                    getUserByAuth(authUserId:"${authUserId}"){
                        id
                        name
                    }
                }
              `,
        },
          { withCredentials: true }
        );

        // If the response status is 200, it means the user is authenticated
        //console.log("getUserId response:", response.data.data.getUserByAuth.id);
        setUserId(response.data.data.getUserByAuth.id);
        setName(response.data.data.getUserByAuth.name);
      } catch (error) {
        // Check if it's a redirect
        if (
          error.response &&
          error.response.status === 302 &&
          error.response.headers.location
        ) {
          
          window.location.href = "https://adventure-clicker.netlify.app/login";
          toast.warn("Bitte melde dich an.");
        } else {
          console.error("Login failed:", error);
          toast.error("Fehler beim Abrufen der Benutzerdaten.");
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
      <ToastContainer />
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
