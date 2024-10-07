import React from 'react';
import '../css/Top.css'; 

const Top = () => {
  const isLoggedIn = false; 

  return (
    <div className="top-header">
      <div>Match Your Style</div>
      <button className="login-logout-btn">
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}

export default Top;