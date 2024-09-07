import { useState } from "react";
import axios from "axios";
import '../css/Login.css';

const Login = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");



  const handleRegisterLocal = async () => {
    try {
      const response = await axios.post(
        `https://adventure-clicker-backend.onrender.com/register`,
        { username: loginUsername, password: loginPassword },
        { withCredentials: true }
      );

      console.log("Registration response:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  /*
  const handleLoginGoogle = () => {
    window.location.href = `https://adventure-clicker-backend.onrender.com/google`;
  };
  */

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