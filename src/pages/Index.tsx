
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from '../components/LandingPage';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/dashboard/${user.userType}`} replace />;
  }

  return <LandingPage />;
};

export default Index;
