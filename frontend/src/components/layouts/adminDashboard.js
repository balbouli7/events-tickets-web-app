import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../../context.js/authContext';
import { CartContext } from '../../context.js/cartContext';
import { OrdersContext } from '../../context.js/orderContext';

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { orders ,refreshOrders  } = useContext(OrdersContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('cartItems');
    clearCart();
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
            { label: 'Home', path: '/home' },
            { label: 'Users', path: '/users' },
            { label: 'Events', path: '/events' },
            { label: 'Category', path: '/allCategories' },
            { label: 'Tickets', path: '/allTickets' },
            { label: 'Settings', path: '/settings' },
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
            {/* Orders Icon with Badge */}
            <div style={{ position: 'relative' }}>
              <Link
                to="/myOrders"
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
              {orders.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    backgroundColor: '#E94560',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {orders.length}
                </span>
              )}
            </div>

            {/* Logout Button */}
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