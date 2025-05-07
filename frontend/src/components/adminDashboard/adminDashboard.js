import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../../context.js/authContext';

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        background: 'rgba(30, 30, 47, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: '#FFFFFF',
          fontSize: '30px',
          textDecoration: 'none',
          fontWeight: '800',
          fontFamily: 'Poppins, sans-serif',
          letterSpacing: '1px',
        }}
      >
        🎟️ MyApp
      </Link>

      {/* Admin Links */}
      {user && (
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { label: 'Home', path: '/admin/home' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Events', path: '/admin/events' },
            { label: 'Orders', path: '/admin/orders' },
            { label: 'Settings', path: '/admin/settings' },
          ].map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              style={{
                color: '#D3D3D3',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#5D5FEF';
                e.target.style.color = '#FFF';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#D3D3D3';
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Right Section */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link
              to="/cart"
              style={{
                color: '#D3D3D3',
                fontSize: '22px',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.color = '#FFD700')}
              onMouseOut={(e) => (e.target.style.color = '#D3D3D3')}
            >
              <FaShoppingCart />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                color: '#fff',
                backgroundColor: '#E94560',
                padding: '10px 22px',
                borderRadius: '25px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#c9374f')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#E94560')}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '15px',
                padding: '9px 20px',
                borderRadius: '25px',
                backgroundColor: '#3498DB',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#2980B9')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#3498DB')}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '15px',
                padding: '9px 20px',
                borderRadius: '25px',
                backgroundColor: '#9B59B6',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#8E44AD')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#9B59B6')}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default AdminDashboard;
