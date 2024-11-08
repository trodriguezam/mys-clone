import React, { useState, useEffect } from 'react';
import { FaHome, FaUser, FaCog, FaHeart } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../css/Navbar.css'; 


const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [ready, setReady] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setReady(true);
    }
  }, [user, location]);

  if (!ready) {
    return null;
  }

  return (
    <div className="navbar">
      {user ? (
        <>
      <a href="/home" className="nav-item">
        <FaHome className="icon" />
        <span>Home</span>
      </a>
      <a href="/matches" className="nav-item">
        <FaHeart className="icon" />
        <span>Matches</span>
      </a>
      <a href="/userconfig" className="nav-item">
        <FaUser className="icon" />
        <span>User</span>
      </a>
      <a href="" className="nav-item">
        <FaCog className="icon" />
        <span>Config</span>
      </a>
      </>
      ) : null}
    </div>
  );
};

export default Navbar;