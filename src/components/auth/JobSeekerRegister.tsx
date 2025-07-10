
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import sampleData from '../../data/sampleData.json';

const JobSeekerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    fatherName: '',
    email: '',
    phone: '',
    password: '',
    retypePassword: '',
    username: '',
    dob: '',
    gender: '',
    state: '',
    pincode: '',
    educationLevel: '',
    educationSubcategory: '',
    employmentStatus: '',
    keySkills: '',
    internationalJob: '',
    securityCode: '',
    agreeTerms: false
  });

  const educationOptions = sampleData.educationLevels;
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
      id: 'user_' + Date.now(),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      userType: 'jobSeeker' as const,
      profileData: formData
    };

    login(userData);
    toast.success('Registration successful!');
    navigate('/dashboard/jobSeeker');
  };

  const getSubcategoryOptions = () => {
    if (formData.educationLevel === 'diploma-after-10th') {
      return sampleData.diplomaAfter10th;
    } else if (formData.educationLevel === 'diploma-after-12th') {
      return sampleData.diplomaAfter12th;
    } else if (formData.educationLevel === 'graduate') {
      return sampleData.graduateDegrees;
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>{t('jobSeekerRegistration')}</CardTitle>
          <CardDescription>Fill in your details to register</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fatherName">Father/Guardian Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Gender *</Label>
              <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
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
              <Label htmlFor="educationLevel">Highest Education Level *</Label>
              <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  {educationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(formData.educationLevel === 'diploma-after-10th' || formData.educationLevel === 'diploma-after-12th' || formData.educationLevel === 'graduate') && (
              <div>
                <Label htmlFor="educationSubcategory">Specialization *</Label>
                <Select value={formData.educationSubcategory} onValueChange={(value) => handleInputChange('educationSubcategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubcategoryOptions().map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="employmentStatus">Employment Status *</Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="keySkills">Key Skills</Label>
              <Input
                id="keySkills"
                value={formData.keySkills}
                onChange={(e) => handleInputChange('keySkills', e.target.value)}
                placeholder="e.g., Plumbing, Carpentry, Painting"
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
              <Label htmlFor="username">Choose Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
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
            <div>
              <Label>Are you interested in international jobs?</Label>
              <RadioGroup value={formData.internationalJob} onValueChange={(value) => handleInputChange('internationalJob', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="intl-yes" />
                  <Label htmlFor="intl-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="intl-no" />
                  <Label htmlFor="intl-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="securityCode">Security Code *</Label>
              <Input
                id="securityCode"
                value={formData.securityCode}
                onChange={(e) => handleInputChange('securityCode', e.target.value)}
                placeholder="Enter CAPTCHA: ABC123"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Demo: Use ABC123</p>
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
            Register
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

export default JobSeekerRegister;
