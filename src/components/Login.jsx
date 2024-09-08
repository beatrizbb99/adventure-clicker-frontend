import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import '../css/Login.css';
import { useNavigate } from "react-router-dom";

const API_URL = "https://adventure-clicker-backend.onrender.com";

const Login = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginLocal = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { username: loginUsername, password: loginPassword },
        { withCredentials: true }
      );

      // Assuming the token is returned in the response and you want to store it
      toast.info(response.data);
      const token = response.data.token; // Adjust according to your actual response structure
      localStorage.setItem("jwtToken", token);


      console.log("Login response:", response.data);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegisterLocal = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        { username: loginUsername, password: loginPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add the token in the header
          }
        },
        { withCredentials: true }
      );

      console.log("Registration response:", response.data);
      alert("Registration successful. You can now log in.");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="img-container">
          <div className="game-title">Adventure Clicker</div>
        </div>
        <div className="login-box">
          <h2>Login</h2>
          <div>
            <label htmlFor="loginUsername">Username:</label>
            <input
              type="text"
              id="loginUsername"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />

            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          <button onClick={handleLoginLocal}>Login with Local</button>
          <button onClick={handleRegisterLocal}>Register with Local</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
