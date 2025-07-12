
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import sampleData from '../../data/sampleData.json';

const JobProviderRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    retypePassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    industry: '',
    companySize: '',
    gstNumber: '',
    website: '',
    agreeTerms: false
  });

  const states = sampleData.states;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.password !== formData.retypePassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error('Please agree to terms and conditions');
      return;
    }

    const userData = {
      id: 'provider_' + Date.now(),
      name: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      userType: 'jobProvider' as const,
      profileData: formData
    };

    login(userData);
    toast.success('Registration successful! Your details have been shared with NCS.');
    navigate('/dashboard/jobProvider');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>{t('jobProviderRegistration')}</CardTitle>
          <CardDescription>Register your company to hire skilled professionals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Mobile Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="retypePassword">Retype Password *</Label>
              <Input
                id="retypePassword"
                type="password"
                value={formData.retypePassword}
                onChange={(e) => handleInputChange('retypePassword', e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Company Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companySize">Company Size *</Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">I agree to the Terms and Conditions *</Label>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Register Company
          </Button>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth-choice?action=register')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobProviderRegister;
