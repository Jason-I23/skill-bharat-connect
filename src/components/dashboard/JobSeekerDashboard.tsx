
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Briefcase, MapPin, Clock, Star, Users, CheckCircle, Calendar } from 'lucide-react';
import sampleData from '../../data/sampleData.json';

const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const stats = {
    applied: appliedJobs.length,
    completed: 0,
    inProgress: 0
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleCheckout = () => {
    if (selectedJobs.length === 0) return;
    
    setAppliedJobs(prev => [...prev, ...selectedJobs]);
    setSelectedJobs([]);
    // Show confirmation popup (simplified for demo)
    alert(`Applied for ${selectedJobs.length} jobs successfully!`);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{t('welcome')}, {user?.name}!</h1>
        <p className="opacity-90">Explore job opportunities and build your career</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{stats.applied}</div>
            <div className="text-sm text-gray-600">Jobs Applied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-gray-600">Jobs Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Certifications</CardTitle>
          <CardDescription>Complete these certifications to access better job opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleData.certifications.slice(0, 4).map((cert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold">{cert.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Duration: {cert.duration}</span>
                  <Button size="sm">Start Course</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Jobs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Available Jobs</CardTitle>
              <CardDescription>Jobs matching your skills and location</CardDescription>
            </div>
            {selectedJobs.length > 0 && (
              <Button onClick={handleCheckout}>
                Checkout ({selectedJobs.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleData.jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">₹{job.salary}</div>
                  <div className="text-sm text-gray-600">{job.paymentType}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {job.location}
                </Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {job.type}
                </Badge>
                <Badge variant="outline">
                  <Star className="w-3 h-3 mr-1" />
                  {job.rating}
                </Badge>
              </div>

              <p className="text-sm text-gray-600">{job.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-sm text-gray-600">
                  <span><Users className="w-4 h-4 inline mr-1" />{job.applicants} applied</span>
                  <span><CheckCircle className="w-4 h-4 inline mr-1" />{job.recruited} recruited</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={selectedJobs.includes(job.id)}
                    onChange={() => handleJobSelect(job.id)}
                    className="mr-2"
                  />
                  <Button 
                    variant={selectedJobs.includes(job.id) ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedJobs.includes(job.id) ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Applied Jobs */}
      {appliedJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Applied Jobs</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {appliedJobs.map((jobId, index) => {
                const job = sampleData.jobs.find(j => j.id === jobId);
                return job ? (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <Badge>Pending</Badge>
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobSeekerDashboard;
