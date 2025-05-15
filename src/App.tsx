import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// Components
import Login from './pages/Login';
import UserRegistration from './pages/UserRegistration';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingApproval from './pages/PendingApproval';
import RejectedApplication from './pages/RejectedApplication';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

// Context
import { AuthProvider } from './context/AuthContext';

// API
import { getUserByEmail } from './api/userApi';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route 
              path="/pending-approval" 
              element={
                <ProtectedRoute>
                  <PendingApproval />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rejected" 
              element={
                <ProtectedRoute>
                  <RejectedApplication />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/*" 
              element={
                <ProtectedRoute requireApproved={true} userType="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireApproved={false} userType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer position="top-right" theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;