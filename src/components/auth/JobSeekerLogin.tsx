import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { toast } from '../ui/use-toast';

const JobSeekerLogin: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login logic
    const userData = {
      id: '1',
      name: 'John Doe',
      email: formData.email,
      userType: 'jobSeeker' as const,
      isNewUser: false // Existing user
    };

    login(userData);
    toast.success('Login successful!');
    navigate('/dashboard/jobSeeker');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md bg-white shadow-md rounded-lg">
        <CardHeader className="flex flex-col space-y-1 p-6">
          <CardTitle className="text-2xl font-semibold text-center">{t('job_seeker_login')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('your_email')}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('your_password')}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {t('login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSeekerLogin;
