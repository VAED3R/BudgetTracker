import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LoginSignup } from './components/LoginSignup/LoginSignup';
import { Home } from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income';
import Expenses from './components/Expenses/Expenses';
import OneTimeTransactions from './components/OneTimeTransactions/OneTimeTransactions';

const AnimatedRoutes = ({ user }) => {
    const location = useLocation(); // ✅ Required for exit animations

    return (
        <AnimatePresence mode="wait"> 
            <Routes location={location} key={location.pathname}> {/* ✅ Key is necessary */}
                <Route path="/" element={user ? <Navigate to="/home" /> : <LoginSignup />} />
                <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/income" element={user ? <Income /> : <Navigate to="/" />} />
                <Route path="/expenses" element={user ? <Expenses /> : <Navigate to="/" />} />
                <Route path="/one-time-transactions" element={user ? <OneTimeTransactions /> : <Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
