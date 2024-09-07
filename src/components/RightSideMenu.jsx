import { IoIosClose } from "react-icons/io";
import '../css/RightSideMenu.css';

const RightSideMenu = ({ content, onClose }) => {
  return (
    <div className="right-side-menu">
      <IoIosClose className='close-icon' onClick={() => onClose()} />
      {content}
    </div>
  );
};

export default RightSideMenu;
