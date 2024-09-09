import { useNavigate } from "react-router-dom";
import '../css/Logout.css';
import socket from "./socket";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
      localStorage.removeItem("jwtToken");

      if (socket) {
        socket.disconnect();
      }

      // Weiterleitung zur Login-Seite
      navigate("/login");
  };

  const handleGoBack = () => {
    navigate("/"); // Weiterleitung zur Startseite
  };

  return (
    <div className='logout-bg'>
      <div className='logout-container'>
        <h2>Do you want to logout?</h2>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    </div>
  );
};

export default Logout;
