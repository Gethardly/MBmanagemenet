import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { User } from '../types';

interface Props {
  user: User | undefined | null;
  role?: string;
}

const Protected: React.FC<Props> = ({user, role}) => {
  if (user && user.token && (role && role === user.role)) {
    return <Outlet/>;
  } else if (user && user.token) {
    return <Navigate to="/"/>;
  } else {
    return <Navigate to="/login"/>;
  }
};
export default Protected;
