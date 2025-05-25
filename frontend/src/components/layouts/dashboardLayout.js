// src/layouts/AdminLayout.
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboard from './adminDashboard';
import HomePage from './homePage';
import { AuthContext } from '../../context.js/authContext';

const DashboardLayout = () => {
  const{user}=useContext(AuthContext)
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: 'black' }}>
      {user?.role === 'admin' ? <AdminDashboard /> : <HomePage />}
      <div style={{ paddingTop: '70px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
