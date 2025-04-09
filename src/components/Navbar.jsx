import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <h5 className="navbar-logo" onClick={() => navigate('/')}>
        Product <span className="white">Inventory</span>
      </h5>

      <ul className="nav-links">
        {!user && (
          <>
            <li><a onClick={() => navigate('/login')}>Login</a></li>
            <li><a onClick={() => navigate('/register')}>Register</a></li>
          </>
        )}

        {user && (
          <>
            {(user.role === 'admin' || user.role === 'manager') && (
              <li><a onClick={() => navigate('/products')}>Products</a></li>
            )}
            <li className="user-info">
              Welcome, <strong>{user.username}</strong> ({user.role})
            </li>
            <li><a onClick={handleLogout}>Logout</a></li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
