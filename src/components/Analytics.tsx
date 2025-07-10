
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Star, Users, Briefcase, Calendar, Award } from 'lucide-react';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Mock analytics data based on user type
  const getAnalyticsData = () => {
    if (user?.userType === 'jobSeeker') {
      return {
        monthlyEarnings: [
          { month: 'Jan', amount: 15000 },
          { month: 'Feb', amount: 22000 },
          { month: 'Mar', amount: 18000 },
          { month: 'Apr', amount: 25000 },
          { month: 'May', amount: 28000 },
          { month: 'Jun', amount: 32000 }
        ],
        topSkills: [
          { skill: 'Plumbing', jobs: 12, earnings: 45000 },
          { skill: 'Electrical', jobs: 8, earnings: 32000 },
          { skill: 'Carpentry', jobs: 6, earnings: 28000 }
        ],
        ratings: {
          average: 4.5,
          total: 156,
          breakdown: { 5: 85, 4: 45, 3: 20, 2: 4, 1: 2 }
        },
        recentNotifications: [
          { type: 'job_selected', message: 'Selected for Plumber position at Home Repair Services', date: '2024-01-10' },
          { type: 'payment_received', message: 'Payment of ₹15,000 received for completed job', date: '2024-01-08' },
          { type: 'job_applied', message: 'Applied for Electrical Technician position', date: '2024-01-05' }
        ]
      };
    } else {
      return {
        monthlyHiring: [
          { month: 'Jan', hired: 5, posted: 8 },
          { month: 'Feb', hired: 7, posted: 10 },
          { month: 'Mar', hired: 6, posted: 9 },
          { month: 'Apr', hired: 8, posted: 12 },
          { month: 'May', hired: 10, posted: 14 },
          { month: 'Jun', hired: 12, posted: 15 }
        ],
        paymentAnalytics: [
          { month: 'Jan', amount: 75000 },
          { month: 'Feb', amount: 105000 },
          { month: 'Mar', amount: 90000 },
          { month: 'Apr', amount: 120000 },
          { month: 'May', amount: 140000 },
          { month: 'Jun', amount: 160000 }
        ],
        topJobCategories: [
          { category: 'Plumbing', jobs: 25, hired: 18 },
          { category: 'Electrical', jobs: 20, hired: 15 },
          { category: 'Carpentry', jobs: 15, hired: 12 }
        ],
        ratings: {
          average: 4.3,
          total: 89,
          breakdown: { 5: 45, 4: 28, 3: 12, 2: 3, 1: 1 }
        },
        recentNotifications: [
          { type: 'job_application', message: 'New application received for Plumber position', date: '2024-01-10' },
          { type: 'payment_completed', message: 'Payment of ₹25,000 processed successfully', date: '2024-01-08' },
          { type: 'job_completed', message: 'Electrical work job marked as completed', date: '2024-01-05' }
        ]
      };
    }
  };

  const analyticsData = getAnalyticsData();
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="opacity-90">
          {user?.userType === 'jobSeeker' 
            ? 'Track your earnings, job performance, and career growth' 
            : 'Monitor your hiring metrics, payments, and business insights'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {user?.userType === 'jobSeeker' ? (
          <>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">₹32,000</div>
                <div className="text-sm text-gray-600">This Month</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-gray-600">Jobs Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">4.5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Certifications</div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">48</div>
                <div className="text-sm text-gray-600">Total Hired</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">₹6.9L</div>
                <div className="text-sm text-gray-600">Total Payments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">4.3</div>
                <div className="text-sm text-gray-600">Company Rating</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {user?.userType === 'jobSeeker' ? 'Monthly Earnings' : 'Hiring Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {user?.userType === 'jobSeeker' ? (
                <BarChart data={analyticsData.monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              ) : (
                <LineChart data={analyticsData.monthlyHiring}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hired" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="posted" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ratings Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Rating Distribution
            </CardTitle>
            <CardDescription>
              Average: {analyticsData.ratings.average}/5.0 ({analyticsData.ratings.total} total ratings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress 
                    value={(analyticsData.ratings.breakdown[rating] / analyticsData.ratings.total) * 100} 
                    className="flex-1" 
                  />
                  <span className="text-sm text-gray-600 w-8">
                    {analyticsData.ratings.breakdown[rating]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills/Categories Performance */}
        <Card>
          <CardHeader>
            <CardTitle>
              {user?.userType === 'jobSeeker' ? 'Top Skills Performance' : 'Job Categories Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(user?.userType === 'jobSeeker' ? analyticsData.topSkills : analyticsData.topJobCategories).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {user?.userType === 'jobSeeker' ? item.skill : item.category}
                    </div>
                    <div className="text-sm text-gray-600">
                      {user?.userType === 'jobSeeker' 
                        ? `${item.jobs} jobs • ₹${item.earnings.toLocaleString()}` 
                        : `${item.jobs} posted • ${item.hired} hired`}
                    </div>
                  </div>
                  <Badge variant="outline" style={{ backgroundColor: colors[index % colors.length] + '20', color: colors[index % colors.length] }}>
                    {user?.userType === 'jobSeeker' ? 'Top Skill' : 'Popular'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type.includes('payment') ? 'bg-green-500' :
                    notification.type.includes('selected') ? 'bg-blue-500' :
                    notification.type.includes('applied') ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm">{notification.message}</div>
                    <div className="text-xs text-gray-500">{notification.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
