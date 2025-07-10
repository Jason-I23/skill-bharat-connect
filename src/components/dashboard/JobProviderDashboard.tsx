
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Plus, Eye, Edit, Trash, MapPin, Clock, Users, Star } from 'lucide-react';
import sampleData from '../../data/sampleData.json';

interface Job {
  id: string;
  title: string;
  description: string;
  workType: string;
  toolsRequired: string;
  location: string;
  salary: string;
  paymentType: string;
  status: 'active' | 'paused' | 'completed';
}

const JobProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workType: '',
    toolsRequired: '',
    location: '',
    salary: '',
    paymentType: 'hourly'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateJob = () => {
    const newJob: Job = {
      id: 'job_' + Date.now(),
      ...formData,
      status: 'active'
    };
    setJobs([newJob, ...jobs]);
    setFormData({
      title: '',
      description: '',
      workType: '',
      toolsRequired: '',
      location: '',
      salary: '',
      paymentType: 'hourly'
    });
    setShowCreateForm(false);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      workType: job.workType,
      toolsRequired: job.toolsRequired,
      location: job.location,
      salary: job.salary,
      paymentType: job.paymentType
    });
    setShowCreateForm(true);
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;
    
    setJobs(jobs.map(job => 
      job.id === editingJob.id 
        ? { ...job, ...formData }
        : job
    ));
    setEditingJob(null);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      workType: '',
      toolsRequired: '',
      location: '',
      salary: '',
      paymentType: 'hourly'
    });
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'active').length,
    completedJobs: jobs.filter(job => job.status === 'completed').length
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{t('welcome')}, {user?.name}!</h1>
        <p className="opacity-90">Manage your jobs and find skilled professionals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
            <div className="text-sm text-gray-600">Total Jobs Posted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.completedJobs}</div>
            <div className="text-sm text-gray-600">Completed Jobs</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Job Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>Create and manage your job postings</CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Plumber needed for residential work"
                />
              </div>
              <div>
                <Label htmlFor="workType">Work Type *</Label>
                <Select value={formData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="gardening">Gardening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label htmlFor="salary">Payment Amount *</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="Amount in INR"
                />
              </div>
              <div>
                <Label htmlFor="paymentType">Payment Type *</Label>
                <Select value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="fixed">Fixed Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="toolsRequired">Tools Required</Label>
                <Input
                  id="toolsRequired"
                  value={formData.toolsRequired}
                  onChange={(e) => handleInputChange('toolsRequired', e.target.value)}
                  placeholder="Tools/equipment needed"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the work required"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingJob ? handleUpdateJob : handleCreateJob}>
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowCreateForm(false);
                setEditingJob(null);
                setFormData({
                  title: '',
                  description: '',
                  workType: '',
                  toolsRequired: '',
                  location: '',
                  salary: '',
                  paymentType: 'hourly'
                });
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Posted Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posted Jobs</CardTitle>
          <CardDescription>Manage your active job postings</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No jobs posted yet. Create your first job posting above.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.paymentType}
                        </Badge>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">₹{job.salary}</div>
                      <div className="text-sm text-gray-600">{job.paymentType}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  
                  {job.toolsRequired && (
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Tools required:</strong> {job.toolsRequired}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span><Users className="w-4 h-4 inline mr-1" />5 applicants</span>
                      <span><Star className="w-4 h-4 inline mr-1" />2 shortlisted</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Candidates
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditJob(job)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteJob(job.id)}>
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobProviderDashboard;
