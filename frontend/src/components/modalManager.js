// ModalManager.js
import React, { useState } from 'react';
import Login from './authComponents/login';

const ModalManager = ({ showConfirm, onCancel, onProceed }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleProceed = () => {
    onProceed(); // optional
    setShowLogin(true);
  };

  return (
    <>
      {showConfirm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>You must be logged in to continue.</h3>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={onCancel} style={cancelBtn}>Cancel</button>
              <button onClick={handleProceed} style={okBtn}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <Login />
          </div>
        </div>
      )}
    </>
  );
};

// === Styles ===
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  width: '400px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
};

const cancelBtn = {
  backgroundColor: '#ccc',
  color: '#333',
  padding: '8px 16px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
};

const okBtn = {
  backgroundColor: '#3498db',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
};

export default ModalManager;
