
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, Users, IndianRupee, Calendar, Award } from 'lucide-react';

const Analytics: React.FC = () => {
  const { user } = useAuth();

  // Sample data for job seeker analytics
  const monthlyEarnings = [
    { month: 'Jan', earnings: 8000, jobs: 2 },
    { month: 'Feb', earnings: 12000, jobs: 3 },
    { month: 'Mar', earnings: 15000, jobs: 4 },
    { month: 'Apr', earnings: 18000, jobs: 5 },
    { month: 'May', earnings: 22000, jobs: 6 },
    { month: 'Jun', earnings: 25000, jobs: 7 }
  ];

  const jobsByCategory = [
    { name: 'Plumbing', value: 45, color: '#3B82F6' },
    { name: 'Electrical', value: 30, color: '#10B981' },
    { name: 'Carpentry', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 10, color: '#EF4444' }
  ];

  const skillsPerformance = [
    { skill: 'Plumbing', earnings: 20250, percentage: 45 },
    { skill: 'Electrical', earnings: 13500, percentage: 30 },
    { skill: 'Carpentry', earnings: 6750, percentage: 15 },
    { skill: 'Others', earnings: 4500, percentage: 10 }
  ];

  // Sample data for job provider analytics
  const jobPostingStats = [
    { month: 'Jan', posted: 5, filled: 4, applications: 45 },
    { month: 'Feb', posted: 7, filled: 6, applications: 78 },
    { month: 'Mar', posted: 8, filled: 7, applications: 92 },
    { month: 'Apr', posted: 6, filled: 5, applications: 65 },
    { month: 'May', posted: 9, filled: 8, applications: 108 },
    { month: 'Jun', posted: 10, filled: 9, applications: 125 }
  ];

  const candidateQuality = [
    { category: 'Excellent', count: 15, percentage: 35 },
    { category: 'Good', count: 20, percentage: 47 },
    { category: 'Average', count: 8, percentage: 18 }
  ];

  if (user?.userType === 'jobSeeker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-blue-100">Complete overview of your job performance and growth</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <IndianRupee className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">₹45,000</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">27</div>
                <div className="text-sm text-gray-600">Jobs Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings and Jobs Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings Trend</CardTitle>
                <CardDescription>Your earnings growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                    <Line type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jobs vs Earnings</CardTitle>
                <CardDescription>Correlation between jobs completed and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jobs" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Job Categories and Skills Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Jobs by Category</CardTitle>
                <CardDescription>Distribution of your completed jobs by skill category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jobsByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {jobsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Performance</CardTitle>
                <CardDescription>Earnings breakdown by skill category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsPerformance.map((skill) => (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">₹{skill.earnings.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{skill.percentage}% of total</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Development Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Development & Certifications</CardTitle>
              <CardDescription>Enhance your skills with these recommended courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2">Advanced Plumbing</h4>
                  <p className="text-sm text-gray-600 mb-3">Master advanced plumbing techniques and certification</p>
                  <a
                    href="https://www.ncs.gov.sg/ncs-web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Enroll on NCS Portal →
                  </a>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2">Electrical Safety</h4>
                  <p className="text-sm text-gray-600 mb-3">Safety protocols and electrical work certification</p>
                  <a
                    href="https://www.ncs.gov.sg/ncs-web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Enroll on NCS Portal →
                  </a>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold mb-2">Carpentry Mastery</h4>
                  <p className="text-sm text-gray-600 mb-3">Advanced woodworking and furniture design</p>
                  <a
                    href="https://www.ncs.gov.sg/ncs-web/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Enroll on NCS Portal →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Job Provider Analytics
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Provider Analytics</h1>
          <p className="text-green-100">Complete overview of your job postings and candidate performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-gray-600">Jobs Posted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">39</div>
              <div className="text-sm text-gray-600">Jobs Filled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">513</div>
              <div className="text-sm text-gray-600">Applications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">4.6</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Posting Performance</CardTitle>
              <CardDescription>Monthly job posting and fulfillment rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobPostingStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posted" fill="#3B82F6" name="Posted" />
                  <Bar dataKey="filled" fill="#10B981" name="Filled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidate Quality Distribution</CardTitle>
              <CardDescription>Quality assessment of hired candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidateQuality.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-gray-600">{item.count} candidates ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.category === 'Excellent' ? 'bg-green-500' :
                          item.category === 'Good' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
