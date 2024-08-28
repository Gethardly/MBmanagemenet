import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User } from '../types';

interface AdminRouteProps {
  user: User | null;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ user }) => {
  if (user?.token && user.role === 'admin') {
    return <Outlet />;
  } else if (user?.token) {
    return <Navigate to="/" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;