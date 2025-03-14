import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/FirebaseConfig';
import { motion } from 'framer-motion';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
    }
  }, []);

  return (
    <>
      <div className="home-content">
        <h1>Welcome to your Budget Tracker! 💸</h1>
        <p>Use the income and the expenses tab to add your incomes and expenses</p>
      </div>

      <motion.div
        className="color-sweep"
        initial={{ y: "0%" }} // Start covering the screen
        animate={{ y: "-100%" }} // Move away when loaded
        exit={{ y: "0%" }} // Cover the screen on exit
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </>
  );
};
