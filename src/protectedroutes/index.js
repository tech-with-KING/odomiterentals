import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAdmin} = useAuth()
  if (isLoggedIn || isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};
const ProtectedRoute2 = ({ children }) => {
  const { isLoggedIn, isAdmin} = useAuth()
  if (!isLoggedIn) {
    return <Navigate to="/accounts" />;
  }
  return children;
};
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth()
  if (!isLoggedIn && !isAdmin) {
    return <Navigate to="/accounts" />;
  }
  if (isLoggedIn && !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};
export {AdminRoute, ProtectedRoute2}
export default ProtectedRoute;
