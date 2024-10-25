import React from 'react';
import { FaHome, FaUser, FaCog, FaHeart } from 'react-icons/fa';
import '../css/Navbar.css'; 

const Navbar = () => {
  return (
    <div className="navbar">
      <a href="/" className="nav-item">
        <FaHome className="icon" />
        <span>Home</span>
      </a>
      <a href="/matches" className="nav-item">
        <FaHeart className="icon" />
        <span>Matches</span>
      </a>
      <a href="" className="nav-item">
        <FaUser className="icon" />
        <span>User</span>
      </a>
      <a href="" className="nav-item">
        <FaCog className="icon" />
        <span>Config</span>
      </a>
    </div>
  );
};

export default Navbar;