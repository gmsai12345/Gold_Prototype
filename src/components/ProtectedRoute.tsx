import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproved?: boolean;
  userType?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireApproved = false,
  userType
}) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  // Not authenticated
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  // Check if admin-only route
  if (userType === 'admin' && !userData?.isAdmin) {
    return <Navigate to="/user" />;
  }
  
  // Check if user-only route
  if (userType === 'user' && userData?.isAdmin) {
    return <Navigate to="/admin" />;
  }
  
  // Check if form is required
  if (requireApproved && !userData?.isAdmin) {
    // Form is rejected
    if (userData?.form === -1) {
      return <Navigate to="/rejected" />;
    }
    
    // Form is not filled or pending approval
    if (userData?.form !== 1) {
      return <Navigate to="/register" />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;