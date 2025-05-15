// src/layouts/AdminLayout.
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboard from './adminDashboard';

const AdminLayout = () => {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: 'black' }}>
      <AdminDashboard />
      <div style={{ paddingTop: '70px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
