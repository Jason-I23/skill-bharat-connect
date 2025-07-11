
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

interface DigiLockerAuthProps {
  onAuthComplete?: (verified: boolean) => void;
  className?: string;
}

export const DigiLockerAuth: React.FC<DigiLockerAuthProps> = ({
  onAuthComplete,
  className
}) => {
  const { t } = useLanguage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    
    // Simulate DigiLocker authentication process
    setTimeout(() => {
      setIsVerified(true);
      setIsAuthenticating(false);
      toast.success('Profile verified successfully with DigiLocker!');
      onAuthComplete?.(true);
    }, 2000);
  };

  const handleValidateCredentials = () => {
    // In real implementation, this would redirect to DigiLocker
    window.open('https://digilocker.gov.in/', '_blank');
    toast.info('Redirecting to DigiLocker for document validation...');
  };

  if (isVerified) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-medium text-green-800">{t('verified_profile')}</div>
              <div className="text-sm text-green-600">Authenticated with DigiLocker</div>
            </div>
            <Badge variant="default" className="ml-auto bg-green-600">
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {t('authenticate_profile')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Verify your identity and credentials through DigiLocker to become a trusted candidate.
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAuthenticate}
            disabled={isAuthenticating}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            {isAuthenticating ? 'Authenticating...' : t('digilocker_auth')}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleValidateCredentials}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('validate_credentials')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
