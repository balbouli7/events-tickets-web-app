import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboard from './adminDashboard';
import HomePage from './homePage';
import { AuthContext } from '../../context.js/authContext';
import Footer from './footer';
import HomeNavbar from './homeNavbar';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: "#f9f9f9" , color: 'black' }}>
      {/* Navbar/Header */}
      {user?.role === 'admin' ? <AdminDashboard /> : <HomeNavbar />}

      {/* Main Content */}
      <div style={{ flex: 1, paddingTop: '70px' }}>
        <Outlet />
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
