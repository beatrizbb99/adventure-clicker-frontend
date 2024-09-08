import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
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
        const redirectUrl = error.response.headers.location;
        console.log("Redirecting to:", redirectUrl);
        // Redirect to the login page
        toast.warn("Redirect 1");
        window.location.href = redirectUrl;
      } else {
        console.error("Login failed:", error);
        toast.error("Login fehlgeschlagen 1");
        window.location.href = "https://adventure-clicker.netlify.app/login";
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
          const redirectUrl = error.response.headers.location;
          console.log("Redirecting to:", redirectUrl);
          // Redirect to the login page
          toast.warn("Redirect 2");
          window.location.href = redirectUrl;
        } else {
          console.error("Login failed:", error);
          toast.error("Login fehlgeschlagen 2");
          window.location.href = "https://adventure-clicker.netlify.app/login";
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
