
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Building, ArrowLeft } from 'lucide-react';

const AuthChoice: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const action = searchParams.get('action') || 'login';

  const handleUserTypeChoice = (userType: 'jobSeeker' | 'jobProvider') => {
    navigate(`/${action}/${userType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col p-4">
      {/* Back button at top */}
      <div className="w-full max-w-md mx-auto mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToHome')}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('chooseYourRole')}
            </h1>
            <p className="text-gray-600">
              {action === 'login' ? t('howWouldYouSignIn') : t('whatTypeOfAccount')}
            </p>
          </div>

          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
              onClick={() => handleUserTypeChoice('jobSeeker')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('jobSeeker')}</CardTitle>
                <CardDescription>
                  {t('lookingForJobs')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
              onClick={() => handleUserTypeChoice('jobProvider')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">{t('jobProvider')}</CardTitle>
                <CardDescription>
                  {t('hiringSkilledProfessionals')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
