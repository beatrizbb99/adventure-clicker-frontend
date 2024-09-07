import { useState } from 'react';
import { IoChatbox } from 'react-icons/io5';
import { FaSignOutAlt } from 'react-icons/fa';
import { GiLockedChest } from "react-icons/gi";
import Chatbox from './Chatbox';
import CreateGuild from './CreateGuild';
import JoinGuild from './JoinGuild';
import RightSideMenu from './RightSideMenu';
import '../css/Header.css';
import ItemList from './ItemList';

const Header = ({ userId, name }) => {
  const [showChatbox, setShowChatbox] = useState(false);
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [showJoinGuild, setShowJoinGuild] = useState(false);
  const [showInventory, setShowInventory] = useState(false);


  const toggleComponent = (component) => {
    setShowChatbox(component === 'chatbox' ? !showChatbox : false);
    setShowCreateGuild(component === 'createGuild' ? !showCreateGuild : false);
    setShowJoinGuild(component === 'joinGuild' ? !showJoinGuild : false);
    setShowInventory(component === 'inventory' ? !showInventory : false);
  };

  return (
    <div className='header'>
      <div className='header-icon' onClick={() => toggleComponent('createGuild')}>
        Create Guild
      </div>
      <div className='header-icon' onClick={() => toggleComponent('joinGuild')}>
        Join Guild
      </div>
      <GiLockedChest className='header-icon' onClick={() => toggleComponent('inventory')} />
      <IoChatbox className='header-icon' onClick={() => toggleComponent('chatbox')} />
      <a href="/logout" className='header-icon'>
        <FaSignOutAlt />
      </a>
      
      {showChatbox && <RightSideMenu content={<Chatbox userId={userId} name={name}/>} onClose={() => toggleComponent('chatbox')} />}
      {showCreateGuild && <RightSideMenu content={<CreateGuild creatorId={userId} />} onClose={() => toggleComponent('createGuild')} />}
      {showJoinGuild && <RightSideMenu content={<JoinGuild userId={userId} />} onClose={() => toggleComponent('joinGuild')} />}
      {showInventory && <RightSideMenu content={<ItemList userId={userId} />} onClose={() => toggleComponent('inventory')} />}
    </div>
  );
};

export default Header;
