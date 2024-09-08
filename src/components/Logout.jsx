import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `https://adventure-clicker-backend.onrender.com/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add the token in the header
          }
        }
      );

      console.log(response.data);
      localStorage.removeItem("jwtToken"); // Entferne den Token aus localStorage

      // Weiterleitung zur Login-Seite
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
