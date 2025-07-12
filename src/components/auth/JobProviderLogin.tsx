import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

const JobProviderLogin: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simulate login for existing user (without isNewUser flag)
    const userData = {
      id: 'jobprovider_123',
      name: 'Jane Smith',
      email: credentials.email,
      phone: '+91 9876543210',
      userType: 'jobProvider' as const,
      profileData: {
        company: 'TechCorp Solutions',
        verified: true,
        rating: 4.5
      },
      // Note: No isNewUser flag for existing users
    };

    login(userData);
    toast.success('Login successful! Welcome back.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('job_provider')} Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to manage your job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobProviderLogin;
