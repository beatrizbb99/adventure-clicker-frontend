import { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import '../css/Chat.css';

const Chatbox = ({ userId, name }) => {
  const [activeChat, setActiveChat] = useState('global');
  const [userGuild, setUserGuild] = useState(null);
  const [guildName, setGuildName] = useState(null);
  const [loadingGuild, setLoadingGuild] = useState(true); // Loading state added

  const toggleChat = (chatId) => {
    setActiveChat(chatId);
  };

  const getUserGuild = async () => {
    try {
      const response = await axios.post('https://adventure-clicker-backend.onrender.com/graphql', {
        query: `
          query {
            getUserById(id:"${userId}"){
              gildenId
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        }
      },
        { withCredentials: true }
      );

      const result = await response.data;
      setUserGuild(result.data.getUserById.gildenId);
      return result.data.getUserById.gildenId;
    } catch (error) {
      console.error('Error fetching user guild:', error);
      return null;
    }
  };

  const getGuildName = async () => {
    const userGuildId = await getUserGuild();

    if (userGuildId !== null) {
      try {
        const response = await axios.post('https://adventure-clicker-backend.onrender.com/graphql', {
          query: `
            query {
              getGildeById(id:"${userGuildId}") {
                name
              }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          }
        },
          { withCredentials: true }
        );

        const result = await response.data;
        setGuildName(result.data.getGildeById.name);
      } catch (error) {
        console.error('Error fetching guild name:', error);
      } finally {
        setLoadingGuild(false); // Stop loading once the request is done
      }
    } else {
      setLoadingGuild(false); // Stop loading if no guild is found
    }
  };

  useEffect(() => {
    getGuildName();
  }, []);

  return (
    <div className={'whole-chat'}>
      <div>
        <div className='chat-buttons'>
          <button
            onClick={() => toggleChat('global')}
            className={activeChat === 'global' ? 'active-link chat-tab-button' : 'chat-tab-button'}
          >
            Global Chat
          </button>
          <button
            onClick={() => toggleChat('guild')}
            className={activeChat === 'guild' ? 'active-link chat-tab-button' : 'chat-tab-button'}
            disabled={loadingGuild || !guildName} // Disable button while loading or if no guild is found
          >
            {loadingGuild ? 'Loading...' : guildName || 'No Guild'}
          </button>
        </div>

        <div className={`chat ${activeChat === 'global' ? 'chat-shown' : 'chat-hidden'}`}>
          <Chat userId={userId} name={name} guildId="65a46184c9cd9e13114ae074"></Chat>
        </div>
        <div className={`chat ${activeChat === 'guild' ? 'chat-shown' : 'chat-hidden'}`}>
          {userGuild !== null && <Chat userId={userId} name={name} guildId={userGuild}></Chat>}
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
