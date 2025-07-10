
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Briefcase, TrendingUp, Award, Shield, CheckCircle, Star, ExternalLink } from 'lucide-react';

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

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
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

        {/* Credibility Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className={`font-bold text-gray-900 mb-4 ${language === 'ta' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
              {t('whyTrustUs')}
            </h2>
            <p className={`text-gray-600 max-w-3xl mx-auto ${language === 'ta' ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
              {t('credibilityDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className={`font-semibold mb-2 ${language === 'ta' ? 'text-base' : 'text-lg'}`}>
                {t('governmentBacked')}
              </h3>
              <p className={`text-gray-600 ${language === 'ta' ? 'text-sm' : 'text-sm'}`}>
                {t('governmentBackedDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className={`font-semibold mb-2 ${language === 'ta' ? 'text-base' : 'text-lg'}`}>
                {t('verifiedJobs')}
              </h3>
              <p className={`text-gray-600 ${language === 'ta' ? 'text-sm' : 'text-sm'}`}>
                {t('verifiedJobsDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className={`font-semibold mb-2 ${language === 'ta' ? 'text-base' : 'text-lg'}`}>
                {t('skillDevelopment')}
              </h3>
              <p className={`text-gray-600 ${language === 'ta' ? 'text-sm' : 'text-sm'}`}>
                {t('skillDevelopmentDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t('skillIndiaJobs')}</h3>
              <p className="text-gray-400 text-sm">
                {t('footerDescription')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('governmentLinks')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://skillindiadigital.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                    {t('skillIndiaPortal')} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                    {t('indiaGov')} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a href="https://www.ncs.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                    {t('nationalCareerService')} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('aboutUs')}</a></li>
                <li><a href="#" className="hover:text-white">{t('contactUs')}</a></li>
                <li><a href="#" className="hover:text-white">{t('privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-white">{t('termsOfService')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('support')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white">{t('faq')}</a></li>
                <li><a href="#" className="hover:text-white">{t('technicalSupport')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 {t('skillIndiaJobs')}. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
