import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";
axios.defaults.withCredentials = true;

import Game from "./components/Game";
import Logout from "./components/Logout";
import Login from "./components/Login";
import CircularLoadingBar from "./components/CircularLoadingBar";

const GameScreen = () => {
  const [authUserId, setAuthUserId] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const checkGame = async () => {
    try {
      const response = await axios.get(
        `https://adventure-clicker-backend.onrender.com`,
        { withCredentials: true }
      );      

      // If the response is successful, the user is authenticated
      console.log("Authentication response:", response);
      setAuthUserId(response.data.user._id);
      toast.success(`Angemeldet als ${response.data.user.username}`);
    } catch (error) {
      // Check if it's a 401 Unauthorized error
      if (error.response && error.response.status === 401) {
        toast.warn("Nicht authentifiziert, Weiterleitung zur Login-Seite.");
        // Redirect to the login page
        navigate("/login");
      } else {
        console.error("Login failed:", error);
        toast.error(`Login fehlgeschlagen ${error.message}`);
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
        { withCredentials: true });

        setUserId(response.data.data.getUserByAuth.id);
        setName(response.data.data.getUserByAuth.name);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.warn("Nicht authentifiziert, Weiterleitung zur Login-Seite.");
          navigate("/login");
        } else {
          console.error("Login failed:", error);
          toast.error("Login fehlgeschlagen 2");
        }
      }
    };

    if (authUserId) {
      console.log("authUserId", authUserId);
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
