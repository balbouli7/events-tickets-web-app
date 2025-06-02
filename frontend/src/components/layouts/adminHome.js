import React from 'react';
import AdminChatPanel from '../chatComponents/adminPanelChat';

const AdminHome = () => {
  const styles = {
    title: {
      fontSize: '2rem',
      marginBottom: '10px',
      color: 'black', 
    },
    paragraph: {
      fontSize: '1rem',
      color: 'black', 

    },
  };

  return (
    <div >
      <h1 style={styles.title}>Welcome, Admin!</h1>
      <p style={styles.paragraph}>Here’s a quick overview of your platform.</p>
    </div>
  );
};

export default AdminHome;
