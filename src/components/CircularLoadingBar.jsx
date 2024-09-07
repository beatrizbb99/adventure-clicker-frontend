import React from "react";
import "../CircularLoadingBar.css"; // You can define your styles in this CSS file

const CircularLoadingBar = ({ size, strokeWidth }) => {
  return (
    <div className="spinning-circular-loading-bar">
      <div className="spinner-container">
        <div className="spinner">
          <div className="spinner-inner"></div>
        </div>
      </div>
    </div>
  );
};
export default CircularLoadingBar;
