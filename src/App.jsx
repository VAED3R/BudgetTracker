import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { auth } from './Firebase/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar/Navbar';
import AnimatedRoutes from './AnimatedRoutes';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Track if user is logged in (Even After Refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      {user && <Navbar />}
      <AnimatedRoutes user={user} />
    </Router>
  );
}

export default App;
