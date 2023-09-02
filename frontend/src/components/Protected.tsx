import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { User } from '../types';

interface Props {
  user: User | undefined | null;
}

const Protected: React.FC<Props> = ({ user }) => {
  if (user && user.token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
export default Protected;
