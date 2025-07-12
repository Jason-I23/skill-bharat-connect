
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Briefcase, MapPin, Search, DollarSign, Activity, Target } from 'lucide-react';

// Mock data for analytics
const mockAnalyticsData = {
  today: {
    totalJobs: 1247,
    totalJobSeekers: 8945,
    completedJobs: 156,
    totalSearches: 2341,
    totalEarnings: 2450000,
    conversionRate: 12.5,
    realTimeStats: {
      activeUsers: 234,
      newJobPosts: 45,
      newRegistrations: 78
    }
  },
  overall: {
    totalJobs: 15678,
    totalJobSeekers: 125000,
    completedJobs: 8945,
    totalSearches: 456789,
    totalEarnings: 125000000,
    conversionRate: 57.1,
    realTimeStats: {
      activeUsers: 1234,
      newJobPosts: 567,
      newRegistrations: 890
    }
  }
};

const cityData = [
  { city: 'Mumbai', jobSeekers: 25000, jobProviders: 1200, completedJobs: 1800 },
  { city: 'Delhi', jobSeekers: 22000, jobProviders: 1100, completedJobs: 1650 },
  { city: 'Bangalore', jobSeekers: 20000, jobProviders: 950, completedJobs: 1500 },
  { city: 'Chennai', jobSeekers: 18000, jobProviders: 850, completedJobs: 1200 },
  { city: 'Kolkata', jobSeekers: 15000, jobProviders: 700, completedJobs: 950 },
  { city: 'Hyderabad', jobSeekers: 12000, jobProviders: 600, completedJobs: 800 },
  { city: 'Pune', jobSeekers: 10000, jobProviders: 500, completedJobs: 650 },
  { city: 'Ahmedabad', jobSeekers: 8000, jobProviders: 400, completedJobs: 500 }
];

const trendData = [
  { month: 'Jan', jobs: 1200, jobSeekers: 8500, earnings: 1200000 },
  { month: 'Feb', jobs: 1350, jobSeekers: 9200, earnings: 1450000 },
  { month: 'Mar', jobs: 1180, jobSeekers: 8900, earnings: 1350000 },
  { month: 'Apr', jobs: 1420, jobSeekers: 9800, earnings: 1680000 },
  { month: 'May', jobs: 1560, jobSeekers: 10500, earnings: 1850000 },
  { month: 'Jun', jobs: 1340, jobSeekers: 9600, earnings: 1520000 }
];

const distributionData = [
  { name: 'Completed Jobs', value: 35, color: '#10b981' },
  { name: 'Ongoing Jobs', value: 45, color: '#3b82f6' },
  { name: 'Job Searches', value: 20, color: '#f59e0b' }
];

const chartConfig = {
  jobs: { label: 'Jobs', color: '#3b82f6' },
  jobSeekers: { label: 'Job Seekers', color: '#10b981' },
  earnings: { label: 'Earnings', color: '#f59e0b' }
};

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchCity, setSearchCity] = useState('');
  const [realTimeCounter, setRealTimeCounter] = useState(0);

  // Real-time counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentData = mockAnalyticsData[activeTab as keyof typeof mockAnalyticsData];
  
  const filteredCityData = cityData.filter(city => 
    city.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights into job market performance</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="overall">Overall</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Jobs</p>
                      <p className="text-2xl font-bold">{currentData.totalJobs.toLocaleString()}</p>
                      <Badge variant="secondary" className="mt-1 bg-blue-400/20 text-blue-100">
                        Live: +{realTimeCounter}
                      </Badge>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Job Seekers</p>
                      <p className="text-2xl font-bold">{currentData.totalJobSeekers.toLocaleString()}</p>
                      <Badge variant="secondary" className="mt-1 bg-green-400/20 text-green-100">
                        Active: {currentData.realTimeStats.activeUsers}
                      </Badge>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold">{formatCurrency(currentData.totalEarnings)}</p>
                      <Badge variant="secondary" className="mt-1 bg-orange-400/20 text-orange-100">
                        Growth: +15%
                      </Badge>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Conversion Rate</p>
                      <p className="text-2xl font-bold">{currentData.conversionRate}%</p>
                      <Badge variant="secondary" className="mt-1 bg-purple-400/20 text-purple-100">
                        Trending Up
                      </Badge>
                    </div>
                    <Target className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Completed Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{currentData.completedJobs.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Search className="h-5 w-5 mr-2 text-blue-600" />
                    Total Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{currentData.totalSearches.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    New Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">{currentData.realTimeStats.newRegistrations}</p>
                </CardContent>
              </Card>
            </div>

            {/* Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Job Distribution Overview</CardTitle>
                <CardDescription>Distribution of job activities across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* City-wise Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  City-wise Statistics
                </CardTitle>
                <CardDescription>Job seekers and providers across major Indian cities</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Input
                    placeholder="Search cities..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="max-w-xs"
                  />
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Filter by city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cityData.map((city) => (
                        <SelectItem key={city.city} value={city.city.toLowerCase()}>
                          {city.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredCityData.map((city) => (
                    <Card key={city.city} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{city.city}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Job Seekers:</span>
                            <span className="font-medium">{city.jobSeekers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Job Providers:</span>
                            <span className="font-medium">{city.jobProviders.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completed Jobs:</span>
                            <span className="font-medium text-green-600">{city.completedJobs.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Trends</CardTitle>
                  <CardDescription>Monthly job posting trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="jobs" stroke={chartConfig.jobs.color} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Seeker Growth</CardTitle>
                  <CardDescription>Monthly job seeker registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="jobSeekers" stroke={chartConfig.jobSeekers.color} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Monthly earnings distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="earnings" fill={chartConfig.earnings.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
