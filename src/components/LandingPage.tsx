
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Briefcase, TrendingUp, Award, BookOpen, GraduationCap } from 'lucide-react';
import sampleData from '../data/sampleData.json';

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
          <h1 className={`font-bold text-gray-900 mb-4 ${language === 'ta' ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl'}`}>
            {t('welcome')}
          </h1>
          <p className={`text-gray-600 mb-8 max-w-3xl mx-auto ${language === 'ta' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`}>
            {t('heroDescription')}
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
              <div className={`text-gray-600 ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                {t('jobSeekers')}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className={`text-gray-600 ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                {t('jobsPosted')}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className={`text-gray-600 ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                {t('successRate')}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className={`text-gray-600 ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                {t('certifications')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className={`font-bold text-gray-900 mb-4 ${language === 'ta' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
              {t('availableCertifications')}
            </h2>
            <p className={`text-gray-600 ${language === 'ta' ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
              {t('certificationDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleData.certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
                    <CardTitle className={`${language === 'ta' ? 'text-base' : 'text-lg'}`}>
                      {cert.name}
                    </CardTitle>
                  </div>
                  <CardDescription className={`${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                    {cert.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-gray-600 ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                        {t('duration')}:
                      </span>
                      <span className={`font-medium ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                        {cert.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-gray-600 ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                        {t('level')}:
                      </span>
                      <span className={`font-medium ${language === 'ta' ? 'text-xs' : 'text-sm'}`}>
                        {cert.level}
                      </span>
                    </div>
                    <Button size="sm" className="w-full mt-4">
                      {t('learnMore')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className={`flex items-center ${language === 'ta' ? 'text-lg' : 'text-xl'}`}>
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                {t('forJobSeekers')}
              </CardTitle>
              <CardDescription className={`${language === 'ta' ? 'text-sm' : 'text-base'}`}>
                {t('jobSeekerDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 text-gray-600 ${language === 'ta' ? 'text-sm' : 'text-sm'}`}>
                <li>• {t('jobSeekerFeature1')}</li>
                <li>• {t('jobSeekerFeature2')}</li>
                <li>• {t('jobSeekerFeature3')}</li>
                <li>• {t('jobSeekerFeature4')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className={`flex items-center ${language === 'ta' ? 'text-lg' : 'text-xl'}`}>
                <Briefcase className="w-6 h-6 mr-2 text-green-600" />
                {t('forEmployers')}
              </CardTitle>
              <CardDescription className={`${language === 'ta' ? 'text-sm' : 'text-base'}`}>
                {t('employerDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 text-gray-600 ${language === 'ta' ? 'text-sm' : 'text-sm'}`}>
                <li>• {t('employerFeature1')}</li>
                <li>• {t('employerFeature2')}</li>
                <li>• {t('employerFeature3')}</li>
                <li>• {t('employerFeature4')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
