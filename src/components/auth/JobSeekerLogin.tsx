
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import sampleData from '../../data/sampleData.json';

const JobSeekerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'ncs-check' | 'phone-entry' | 'otp-verification'>('ncs-check');
  const [hasNCSAccount, setHasNCSAccount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleNCSChoice = () => {
    if (!hasNCSAccount) {
      toast.error('Please select an option');
      return;
    }
    
    if (hasNCSAccount === 'no') {
      navigate('/register/jobSeeker');
      return;
    }
    
    setStep('phone-entry');
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Check if phone exists in sample data
    const ncsUser = sampleData.ncsUsers.find(user => user.phone === phoneNumber);
    if (!ncsUser) {
      toast.error('Phone number not found in NCS records');
      return;
    }
    
    // Simulate OTP sending
    toast.success('OTP sent to your phone number');
    setStep('otp-verification');
  };

  const handleOTPVerification = () => {
    if (otp !== '123456') {
      toast.error('Invalid OTP. Use 123456 for demo');
      return;
    }
    
    // Find user data and auto-login
    const ncsUser = sampleData.ncsUsers.find(user => user.phone === phoneNumber);
    if (ncsUser) {
      const userData = {
        id: 'user1',
        name: `${ncsUser.firstName} ${ncsUser.lastName}`,
        email: ncsUser.email,
        phone: ncsUser.phone,
        userType: 'jobSeeker' as const,
        profileData: ncsUser
      };
      
      login(userData);
      toast.success('Login successful! Data loaded from NCS');
      navigate('/dashboard/jobSeeker');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Job Seeker Login</CardTitle>
          <CardDescription>
            {step === 'ncs-check' && 'Let us know about your NCS registration'}
            {step === 'phone-entry' && 'Enter your registered phone number'}
            {step === 'otp-verification' && 'Enter the OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'ncs-check' && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Are you registered with National Career Service (NCS) portal?
                </Label>
                <RadioGroup value={hasNCSAccount} onValueChange={setHasNCSAccount}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes, I am registered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No, I need to register</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button onClick={handleNCSChoice} className="w-full">
                Continue
              </Button>
            </>
          )}

          {step === 'phone-entry' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                />
                <p className="text-xs text-gray-500">
                  Demo: Use 9876543210 to test with sample data
                </p>
              </div>
              <Button onClick={handlePhoneSubmit} className="w-full">
                Send OTP
              </Button>
            </>
          )}

          {step === 'otp-verification' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <p className="text-xs text-gray-500">
                  Demo OTP: 123456
                </p>
              </div>
              <Button onClick={handleOTPVerification} className="w-full">
                Verify & Login
              </Button>
            </>
          )}

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth-choice?action=login')}
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

export default JobSeekerLogin;
