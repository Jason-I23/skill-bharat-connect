import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

const JobProviderLogin: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login logic
    const userData = {
      id: '1',
      name: 'TechCorp Solutions',
      email: formData.email,
      userType: 'jobProvider' as const,
      isNewUser: false // Existing user
    };

    login(userData);
    toast.success('Login successful!');
    navigate('/dashboard/jobProvider');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col space-y-1.5">
          <CardTitle className="text-2xl font-semibold text-center">{t('job_provider_login')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder={t('email_placeholder')}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder={t('password_placeholder')}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit}>{t('login')}</Button>
          <div className="text-sm text-gray-500 text-center">
            {t('no_account')}
            <Button variant="link" onClick={() => navigate('/register/jobProvider')}>
              {t('register')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobProviderLogin;
