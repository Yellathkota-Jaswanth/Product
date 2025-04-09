import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Product from './pages/Product';
import Navbar from './components/Navbar';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Product/>} />
      </Routes>
    </Router>
  );
}

export default App;
