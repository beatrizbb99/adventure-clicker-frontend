import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";

import Game from "./components/Game";
import Logout from "./components/Logout";
import Login from "./components/Login";
import CircularLoadingBar from "./components/CircularLoadingBar";

const API_URL = "https://adventure-clicker-backend.onrender.com";

const GameScreen = () => {
  const [authUserId, setAuthUserId] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const checkGame = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem("jwtToken");

      const response = await axios.get(`${API_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the header
        },
      });

      // If the response is successful, the user is authenticated
      console.log("Authentication response:", response);
      setAuthUserId(response.data.user.id);
      toast.success(`Angemeldet.`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.warn("Nicht authentifiziert, Weiterleitung zur Login-Seite.");
        // Redirect to the login page
        navigate("/login");
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
          `${API_URL}/graphql`,
          {
            query: `
              query {
                  getUserByAuth(authUserId:"${authUserId}"){
                      id
                      name
                  }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add the token in the header
            },
          }
        );
        setUserId(response.data.data.getUserByAuth.id);
        setName(response.data.data.getUserByAuth.name);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.warn("Nicht authentifiziert, Weiterleitung zur Login-Seite.");
          navigate("/login");
        } else {
          console.error("Login failed:", error);
        }
      }
    };

    if (authUserId) {
      getUserId();
    }
  }, [authUserId, navigate]);

  return (
    <div>
      <ToastContainer />
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
