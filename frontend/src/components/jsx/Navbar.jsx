import React from 'react';
import { FaHome, FaShoppingCart, FaUser, FaCog } from 'react-icons/fa';
import '../css/Navbar.css'; 

const Navbar = () => {
  return (
    <div className="navbar">
      <a href="" className="nav-item">
        <FaHome className="icon" />
        <span>Home</span>
      </a>
      <a href="" className="nav-item">
        <FaShoppingCart className="icon" />
        <span>Cart</span>
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