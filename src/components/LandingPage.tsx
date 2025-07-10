
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Briefcase, TrendingUp, Award } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleAuthChoice = (action: 'login' | 'register') => {
    navigate(`/auth-choice?action=${action}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('welcome')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Connecting skilled professionals with opportunities across India. Build your career with government-backed certification programs.'
              : 'இந்தியா முழுவதும் திறமையான தொழில் வல்லுநர்களை வாய்ப்புகளுடன் இணைக்கிறது. அரசாங்க ஆதரவுடைய சான்றிதழ் திட்டங்களுடன் உங்கள் தொழிலை உருவாக்குங்கள்.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleAuthChoice('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              {t('login')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleAuthChoice('register')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              {t('register')}
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Job Seekers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Jobs Posted</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Certifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                For Job Seekers
              </CardTitle>
              <CardDescription>
                Find opportunities that match your skills and get certified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Access to government-verified job opportunities</li>
                <li>• Skill-based job matching</li>
                <li>• Free certification programs</li>
                <li>• Career guidance and mentorship</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-green-600" />
                For Employers
              </CardTitle>
              <CardDescription>
                Connect with skilled and certified professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Access to verified skilled workforce</li>
                <li>• Easy job posting and management</li>
                <li>• Candidate screening and rating system</li>
                <li>• Government partnership benefits</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
