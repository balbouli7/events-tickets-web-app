import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTicketAlt, FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context.js/authContext';
import { CartContext } from '../../context.js/cartContext';
import { OrdersContext } from '../../context.js/orderContext';
import UserChatRequest from '../chatComponents/userChat';

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
      <div style={containerStyle}>
        {/* Logo Section */}
        <div style={logoSectionStyle}>
          <Link 
            to="/" 
            style={logoStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#1D4ED8';
              e.currentTarget.querySelector('svg').style.color = '#1D4ED8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.querySelector('svg').style.color = '#2563EB';
            }}
          >
            <FaTicketAlt style={logoIconStyle} />
            <span> TICKETY</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={navLinkStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            style={navLinkStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Events
          </Link>
          <Link 
            to="/allCategories" 
            style={navLinkStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Categories
          </Link>
          {user && (
            <Link 
              to="/myTickets" 
              style={navLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#2563EB';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              My Tickets
            </Link>
          )}
          {user && (
            <Link 
              to="/settings" 
              style={navLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#2563EB';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Settings
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div style={rightSectionStyle}>
          {/* Cart Icon */}
          <div style={cartContainerStyle}>
            <Link 
              to="/myOrders" 
              style={cartLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
                e.currentTarget.style.borderColor = '#93C5FD';
                e.currentTarget.querySelector('svg').style.color = '#2563EB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.querySelector('svg').style.color = '#6B7280';
              }}
            >
              <FaShoppingCart style={cartIconStyle} />
              {orders.length > 0 && (
                <span style={cartBadgeStyle}>{orders.length}</span>
              )}
            </Link>
          </div>

          {/* Auth Section */}
          {user ? (
            <div style={userSectionStyle}>
              <div 
                style={userInfoStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#93C5FD';
                  e.currentTarget.querySelector('svg').style.color = '#2563EB';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.querySelector('svg').style.color = '#6B7280';
                }}
              >
                <FaUser style={userIconStyle} />
                <span style={userNameStyle}>Welcome</span>
              </div>
              <button 
                onClick={handleLogout} 
                style={logoutButtonStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#EF4444';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#F87171';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={authButtonsStyle}>
              <Link 
                to="/login" 
                style={signInButtonStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                style={signUpButtonStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                  e.currentTarget.style.borderColor = '#1D4ED8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.borderColor = '#2563EB';
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      <UserChatRequest/>
    </nav>
  );
};

// === Modern White Styles ===
const navStyle = {
  background: '#FFFFFF',
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  borderBottom: '1px solid #F0F0F0',
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '16px 24px',
};

const logoSectionStyle = {
  flex: '0 0 auto',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  color: '#2563EB',
  fontSize: '24px',
  fontWeight: '700',
  fontFamily: 'Inter, -apple-system, sans-serif',
  transition: 'all 0.2s ease',
};

const logoIconStyle = {
  fontSize: '28px',
  color: '#2563EB',
  transition: 'all 0.2s ease',
};

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
  flex: '1 1 auto',
  justifyContent: 'center',
};

const navLinkStyle = {
  textDecoration: 'none',
  color: '#374151',
  fontSize: '15px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  position: 'relative',
  fontFamily: 'Inter, -apple-system, sans-serif',
};

const rightSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flex: '0 0 auto',
};

const cartContainerStyle = {
  position: 'relative',
};

const cartLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  backgroundColor: '#F8FAFC',
  borderRadius: '12px',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  border: '1px solid #E5E7EB',
};

const cartIconStyle = {
  fontSize: '18px',
  color: '#6B7280',
  transition: 'all 0.2s ease',
};

const cartBadgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  backgroundColor: '#EF4444',
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: '600',
  borderRadius: '10px',
  padding: '2px 6px',
  minWidth: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #FFFFFF',
};

const userSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: '#F8FAFC',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  transition: 'all 0.2s ease',
};

const userIconStyle = {
  fontSize: '14px',
  color: '#6B7280',
  transition: 'all 0.2s ease',
};

const userNameStyle = {
  fontSize: '14px',
  color: '#374151',
  fontWeight: '500',
  fontFamily: 'Inter, -apple-system, sans-serif',
};

const logoutButtonStyle = {
  backgroundColor: '#F87171',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'Inter, -apple-system, sans-serif',
};

const authButtonsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const signInButtonStyle = {
  textDecoration: 'none',
  color: '#6B7280',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  fontFamily: 'Inter, -apple-system, sans-serif',
  border: '1px solid #E5E7EB',
  backgroundColor: '#FFFFFF',
};

const signUpButtonStyle = {
  textDecoration: 'none',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 20px',
  borderRadius: '8px',
  backgroundColor: '#2563EB',
  transition: 'all 0.2s ease',
  fontFamily: 'Inter, -apple-system, sans-serif',
  border: '1px solid #2563EB',
};

export default HomeNavbar;