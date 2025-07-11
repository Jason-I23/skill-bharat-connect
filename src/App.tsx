import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from 'sonner';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AuthChoice from './components/AuthChoice';
import JobSeekerLogin from './components/auth/JobSeekerLogin';
import JobProviderLogin from './components/auth/JobProviderLogin';
import JobSeekerRegister from './components/auth/JobSeekerRegister';
import JobProviderRegister from './components/auth/JobProviderRegister';
import JobSeekerDashboard from './components/dashboard/JobSeekerDashboard';
import JobProviderDashboard from './components/dashboard/JobProviderDashboard';
import Profile from './components/Profile';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth-choice" element={<AuthChoice />} />
              <Route path="/login/jobSeeker" element={<JobSeekerLogin />} />
              <Route path="/login/jobProvider" element={<JobProviderLogin />} />
              <Route path="/register/jobSeeker" element={<JobSeekerRegister />} />
              <Route path="/register/jobProvider" element={<JobProviderRegister />} />
              <Route path="/dashboard/jobSeeker" element={<JobSeekerDashboard />} />
              <Route path="/dashboard/jobProvider" element={<JobProviderDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="bottom-center" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
