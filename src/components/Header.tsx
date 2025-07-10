
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Globe, Bell, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import NotificationPanel from './NotificationPanel';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notification count - in a real app this would come from context or API
  const unreadNotifications = 3;

  const handleLogoClick = () => {
    if (user) {
      navigate(`/dashboard/${user.userType}`);
    } else {
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAnalyticsClick = () => {
    navigate('/analytics');
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Navigate to home page after logout
  };

  return (
    <>
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">SI</span>
            </div>
            <h1 className={`font-bold ${language === 'ta' ? 'text-lg' : 'text-lg md:text-xl'}`}>
              {t('skillIndiaJobs')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                  <Globe className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'EN' : 'தமிழ்'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ta')}>
                  தமிழ்
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-blue-700 relative"
                  onClick={() => setShowNotifications(true)}
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                      <User className="w-4 h-4 mr-1" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="w-4 h-4 mr-2" />
                      {t('profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAnalyticsClick}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </header>

      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default Header;
