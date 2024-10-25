import React from 'react';
import '../css/Top.css';
import "../../assets/logoMYS.png";

const Top = () => {
  const isLoggedIn = false; 
  let user = localStorage.getItem('user');
  if (null) {
    isLoggedIn = true;
  }

  return (
    <div className="top-header">
      <img src={require("../../assets/logoMYS.png")} alt="Logo" className="logo" style={{ width: '60px', height: '60px' }} />
      <button className="login-logout-btn">
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}

export default Top;