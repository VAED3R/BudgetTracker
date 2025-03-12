import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/FirebaseConfig';

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
    <div>
      <h1>Welcome to your Budget Tracker! 💸</h1>
      <p>Use the navbar to access the features</p>
    </div>
  )
}
