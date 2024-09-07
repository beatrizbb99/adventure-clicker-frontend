import { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import '../css/Chat.css';

const Chatbox = ({ userId, name }) => {
  const [activeChat, setActiveChat] = useState('global');
  const [userGuild, setUserGuild] = useState(null);
  const [guildName, setGuildName] = useState(null);

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
      });

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
        });

        const result = await response.data;
        setGuildName(result.data.getGildeById.name);
      } catch (error) {
        console.error('Error fetching guild name:', error);
      }
    }
  };

  useEffect(() => {
    getGuildName();
  }, []);

  return (
    <div className={'whole-chat'}>
      <div>
        <div className='chat-buttons'>
          <a
            onClick={() => toggleChat('global')}
            className={activeChat === 'global' ? 'active-link chat-tab-button' : 'chat-tab-button'}
          >
            Global Chat
          </a>
          <a
            onClick={() => toggleChat('guild')}
            className={activeChat === 'guild' ? 'active-link chat-tab-button' : 'chat-tab-button'}
          >
            {guildName}
          </a>
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
