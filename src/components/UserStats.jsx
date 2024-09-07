import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { IoIosStats, IoIosClose } from "react-icons/io";
import "../css/UserStats.css";
import socket from "./socket";
import axios from "axios";
axios.defaults.withCredentials = true;

const UserStats = (props) => {
  const [stats, setStats] = useState([]);
  const userId = props.userId;  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getUserStats = async () => {
      try {
        const response = await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
          query: `
              query {
                getUserById(id:"${userId}"){
                  intelligenz
                  staerke
                  geschick
                  energie
                } 
              }
            `,
        });

        const data = response.data.data;

        setStats(data.getUserById);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    socket.on("updateStats", () => {
      // console.log("got update");
      if (userId) getUserStats();
    });

    if (userId) getUserStats();
  }, [userId]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {isExpanded && (
        <div className='user-stats-container'>
          <h3>Your Stats</h3>
          <ul className='stats-list'>
            <li className='stats-item'>
              <strong>Intelligence:</strong> {stats.intelligenz}
            </li>
            <li className='stats-item'>
              <strong>Strength:</strong> {stats.staerke}
            </li>
            <li className='stats-item'>
              <strong>Dexterity:</strong> {stats.geschick}
            </li>
            <li className='stats-item'>
              <img src="/src/assets/images/icons/heart.png" width="32" height="32" alt="Heart Icon"></img> {stats.energie}
            </li>
          </ul>
        </div>
      )}
      <button onClick={toggleExpand} className="toggle-button">
        {isExpanded ? <IoIosClose className='stats-icon'/> : <><IoIosStats className='stats-icon'/>Stats</>}
      </button>
    </div>
  );
};

UserStats.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserStats;
