import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../../context.js/authContext';
import { CartContext } from '../../context.js/cartContext';
import { OrdersContext } from '../../context.js/orderContext';

const HomeNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { orders } = useContext(OrdersContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('cartItems');
    clearCart();
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <div style={leftStyle}>
        <Link to="/" style={logoStyle}>MyTickets 🎟</Link>
      </div>

      <div style={centerStyle}>
        <Link to="/" style={navLink}>Home</Link>
        <Link to="/events" style={navLink}>Events</Link>
        <Link to="/allCategories" style={navLink}>Categories</Link>
        {user && <Link to="/myTickets" style={navLink}>My Tickets</Link>}
        {user && <Link to="/settings" style={navLink}>Settings</Link>}
      </div>

      <div style={rightStyle}>
        <div style={{ position: 'relative' }}>
          <Link to="/myOrders" style={iconLink}>
            <FaShoppingCart />
          </Link>
          {orders.length > 0 && (
            <span style={badgeStyle}>{orders.length}</span>
          )}
        </div>

        {user ? (
          <button onClick={handleLogout} style={logoutButton}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={authButton('#00BFA6', '#00A98F')}>Sign In</Link>
            <Link to="/register" style={authButton('#007BFF', '#0063CC')}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// === Styles ===
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 30px',
  background: 'rgba(10, 10, 25, 0.8)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
};

const leftStyle = {
  flex: 1,
};

const logoStyle = {
  color: '#FFFFFF',
  fontSize: '26px',
  fontWeight: '700',
  textDecoration: 'none',
  fontFamily: 'Poppins, sans-serif',
};

const centerStyle = {
  flex: 2,
  display: 'flex',
  justifyContent: 'center',
  gap: '26px',
};

const rightStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '16px',
};

const navLink = {
  color: '#E0E0E0',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '500',
  position: 'relative',
  padding: '6px 10px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};

const iconLink = {
  color: '#CCCCCC',
  fontSize: '22px',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
};

const badgeStyle = {
  position: 'absolute',
  top: '-5px',
  right: '-10px',
  backgroundColor: '#FF3E55',
  color: '#fff',
  borderRadius: '50%',
  padding: '3px 7px',
  fontSize: '12px',
  fontWeight: 'bold',
};

const logoutButton = {
  backgroundColor: '#FF3E55',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  padding: '8px 18px',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const authButton = (bg, hover) => ({
  color: '#fff',
  backgroundColor: bg,
  textDecoration: 'none',
  padding: '8px 18px',
  borderRadius: '20px',
  fontSize: '14px',
  transition: 'background-color 0.3s ease',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-block',
});

export default HomeNavbar;
