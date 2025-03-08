import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/FirebaseConfig';

export const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is not logged in
    if (!auth.currentUser) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <h1>Welcome to your Budget Tracker! 💸</h1>
      <p>Now you can track your expenses here.</p>
    </div>
  )
}
