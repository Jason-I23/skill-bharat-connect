
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Star, Calendar, Users, Briefcase } from 'lucide-react';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/dashboard/${user?.userType}`);
  };

  // Sample analytics data
  const jobSeekerAnalytics = {
    monthlyEarnings: [
      { month: 'Jan', amount: 8000 },
      { month: 'Feb', amount: 12000 },
      { month: 'Mar', amount: 15000 },
      { month: 'Apr', amount: 10000 },
    ],
    topSkills: [
      { skill: 'Plumbing', jobs: 8, earnings: 25000 },
      { skill: 'Electrical', jobs: 5, earnings: 18000 },
      { skill: 'Carpentry', jobs: 3, earnings: 12000 },
    ],
    ratings: { average: 4.6, total: 16, breakdown: { 5: 10, 4: 4, 3: 2, 2: 0, 1: 0 } },
    recentNotifications: [
      { id: 1, type: 'job_selected', message: 'You were selected for Residential Plumber job', date: '2024-01-25' },
      { id: 2, type: 'payment', message: 'Payment of ₹15,000 received for completed job', date: '2024-01-24' },
      { id: 3, type: 'application', message: 'Your application for Electrical Technician was submitted', date: '2024-01-23' },
    ]
  };

  const jobProviderAnalytics = {
    monthlyHiring: [
      { month: 'Jan', hired: 12, posted: 15 },
      { month: 'Feb', hired: 18, posted: 20 },
      { month: 'Mar', hired: 22, posted: 25 },
      { month: 'Apr', hired: 16, posted: 18 },
    ],
    paymentAnalytics: [
      { month: 'Jan', amount: 120000 },
      { month: 'Feb', amount: 180000 },
      { month: 'Mar', amount: 220000 },
      { month: 'Apr', amount: 160000 },
    ],
    topJobCategories: [
      { category: 'Construction', jobs: 15, hired: 12 },
      { category: 'Plumbing', jobs: 8, hired: 6 },
      { category: 'Electrical', jobs: 6, hired: 5 },
    ],
    recentNotifications: [
      { id: 1, type: 'application', message: 'New application received for Carpenter position', date: '2024-01-25' },
      { id: 2, type: 'payment', message: 'Payment of ₹25,000 completed to John Doe', date: '2024-01-24' },
      { id: 3, type: 'job_completion', message: 'Plumbing job marked as completed', date: '2024-01-23' },
    ]
  };

  const isJobSeeker = user?.userType === 'jobSeeker';
  const analytics = isJobSeeker ? jobSeekerAnalytics : jobProviderAnalytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>

        {isJobSeeker ? (
          <>
            {/* Job Seeker Analytics */}
            
            {/* Earnings Overview */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monthly Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {jobSeekerAnalytics.monthlyEarnings.map((data, index) => (
                    <div key={data.month} className="text-center p-4 border rounded-lg">
                      <div className="font-semibold text-gray-600">{data.month}</div>
                      <div className="text-2xl font-bold text-green-600">₹{data.amount.toLocaleString()}</div>
                      {index > 0 && (
                        <div className="flex items-center justify-center mt-1">
                          {data.amount > jobSeekerAnalytics.monthlyEarnings[index - 1].amount ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{jobSeekerAnalytics.monthlyEarnings.reduce((sum, data) => sum + data.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Earnings</div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Performance */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Top Performing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobSeekerAnalytics.topSkills.map((skill, index) => (
                    <div key={skill.skill} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{skill.skill}</div>
                        <div className="text-sm text-gray-600">{skill.jobs} jobs completed</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">₹{skill.earnings.toLocaleString()}</div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ratings */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Your Ratings & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-yellow-500">{analytics.ratings.average}</div>
                  <div className="text-gray-600">Average Rating from {analytics.ratings.total} reviews</div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-8">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(analytics.ratings.breakdown[star as keyof typeof analytics.ratings.breakdown] / analytics.ratings.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-gray-600">
                        {analytics.ratings.breakdown[star as keyof typeof analytics.ratings.breakdown]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Job Provider Analytics */}
            
            {/* Hiring Overview */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Monthly Hiring Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {jobProviderAnalytics.monthlyHiring.map((data) => (
                    <div key={data.month} className="text-center p-4 border rounded-lg">
                      <div className="font-semibold text-gray-600">{data.month}</div>
                      <div className="text-2xl font-bold text-blue-600">{data.hired}</div>
                      <div className="text-sm text-gray-600">Hired / {data.posted} Posted</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Analytics */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {jobProviderAnalytics.paymentAnalytics.map((data, index) => (
                    <div key={data.month} className="text-center p-4 border rounded-lg">
                      <div className="font-semibold text-gray-600">{data.month}</div>
                      <div className="text-2xl font-bold text-red-600">₹{data.amount.toLocaleString()}</div>
                      {index > 0 && (
                        <div className="flex items-center justify-center mt-1">
                          {data.amount > jobProviderAnalytics.paymentAnalytics[index - 1].amount ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    ₹{jobProviderAnalytics.paymentAnalytics.reduce((sum, data) => sum + data.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Payments Made</div>
                </div>
              </CardContent>
            </Card>

            {/* Top Job Categories */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Top Job Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobProviderAnalytics.topJobCategories.map((category, index) => (
                    <div key={category.category} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{category.category}</div>
                        <div className="text-sm text-gray-600">{category.jobs} jobs posted</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{category.hired} hired</div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Recent Notifications/Activity Log */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentNotifications.map((notification) => (
                <div key={notification.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-sm text-gray-600">{notification.date}</div>
                  </div>
                  <Badge variant={
                    notification.type === 'payment' ? 'default' :
                    notification.type === 'job_selected' ? 'secondary' :
                    'outline'
                  }>
                    {notification.type.replace('_', ' ')}
                  </Badge>
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
