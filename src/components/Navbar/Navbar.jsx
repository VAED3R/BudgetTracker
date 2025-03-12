import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/FirebaseConfig';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/income" className="nav-link">Income</Link>
          <Link to="/expenses" className="nav-link">Expenses</Link>
          <Link to="/one-time-transactions" className="nav-link">OneTimeTransactions</Link>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;