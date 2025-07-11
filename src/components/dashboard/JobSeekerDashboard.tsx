
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { CheckboxDropdown } from '../ui/checkbox-dropdown';
import { JobApplicationsModal } from '../JobApplicationsModal';
import { JobProgressBar } from '../ui/job-progress-bar';
import { Briefcase, MapPin, Clock, Star, Users, CheckCircle, Calendar, IndianRupee, Filter, X, Shield, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import sampleData from '../../data/sampleData.json';

const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['job_1', 'job_3']);
  const [filters, setFilters] = useState({
    locations: [] as string[],
    skills: [] as string[],
    type: '',
    minPayment: '',
    rating: ''
  });
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applicationsModalType, setApplicationsModalType] = useState<'applied' | 'completed' | 'inProgress'>('applied');

  const completedJobs = ['job_2'];
  const inProgressJobs = ['job_1'];
  const totalEarnings = 45000;

  // Get actual applied jobs with details
  const getAppliedJobsWithDetails = () => {
    return sampleData.jobs.filter(job => appliedJobs.includes(job.id));
  };

  // Get completed jobs with details
  const getCompletedJobsWithDetails = () => {
    return sampleData.jobs.filter(job => completedJobs.includes(job.id));
  };

  // Get in-progress jobs with details
  const getInProgressJobsWithDetails = () => {
    return sampleData.jobs.filter(job => inProgressJobs.includes(job.id));
  };

  const stats = {
    applied: appliedJobs.length,
    completed: completedJobs.length,
    inProgress: inProgressJobs.length,
    earnings: totalEarnings
  };

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    setShowJobDialog(true);
  };

  const handleApplyJob = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs(prev => [...prev, jobId]);
      toast.success(t('applied'));
    }
    setShowJobDialog(false);
  };

  const handleCancelApplication = (jobId: string) => {
    setAppliedJobs(prev => prev.filter(id => id !== jobId));
    toast.success('Application cancelled successfully!');
  };

  const clearFilters = () => {
    setFilters({
      locations: [],
      skills: [],
      type: '',
      minPayment: '',
      rating: ''
    });
  };

  const handleStatsClick = (type: 'applied' | 'completed' | 'inProgress') => {
    setApplicationsModalType(type);
    setShowApplicationsModal(true);
  };

  // Get jobs for stats modal based on type
  const getJobsForStatsModal = (type: 'applied' | 'completed' | 'inProgress') => {
    switch (type) {
      case 'applied':
        return getAppliedJobsWithDetails();
      case 'completed':
        return getCompletedJobsWithDetails();
      case 'inProgress':
        return getInProgressJobsWithDetails();
      default:
        return [];
    }
  };

  const filteredJobs = sampleData.jobs.filter(job => {
    // Remove completed jobs from available jobs
    if (completedJobs.includes(job.id)) return false;
    
    return (
      (filters.locations.length === 0 || filters.locations.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()))) &&
      (filters.skills.length === 0 || filters.skills.some(skill => job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase())))) &&
      (!filters.type || job.paymentType === filters.type) &&
      (!filters.minPayment || job.payment >= parseInt(filters.minPayment)) &&
      (!filters.rating || job.rating >= parseFloat(filters.rating))
    );
  });

  const getJobStatus = (jobId: string) => {
    if (completedJobs.includes(jobId)) return 'completed';
    if (inProgressJobs.includes(jobId)) return 'inProgress';
    if (appliedJobs.includes(jobId)) return 'applied';
    return 'available';
  };

  const getJobTagIcon = (tag: string) => {
    switch (tag) {
      case 'verified_job': return <Shield className="w-3 h-3" />;
      case 'high_paying': return <TrendingUp className="w-3 h-3" />;
      case 'skill_match': return <Award className="w-3 h-3" />;
      default: return null;
    }
  };

  const getJobTagLabel = (tag: string) => {
    switch (tag) {
      case 'verified_job': return t('verified_job');
      case 'high_paying': return t('high_paying');
      case 'skill_match': return `${t('skill_match')}`;
      default: return tag;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">{t('welcome')}, {user?.name}!</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('applied')}>
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.applied}</div>
              <div className="text-sm text-gray-600">{t('jobs_applied')}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('completed')}>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-gray-600">{t('jobs_completed')}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('inProgress')}>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">{t('jobs_in_progress')}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <IndianRupee className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">₹{stats.earnings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Job Filters */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('job_filters')}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="location">{t('location')}</Label>
                <CheckboxDropdown
                  options={sampleData.districts}
                  selectedValues={filters.locations}
                  onSelectionChange={(values) => setFilters(prev => ({ ...prev, locations: values }))}
                  placeholder="Select locations"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="skill">{t('skills')}</Label>
                <CheckboxDropdown
                  options={sampleData.skillCategories}
                  selectedValues={filters.skills}
                  onSelectionChange={(values) => setFilters(prev => ({ ...prev, skills: values }))}
                  placeholder="Select skills"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="type">Payment Type</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Label htmlFor="minPayment">Min Payment (₹)</Label>
                <Input
                  id="minPayment"
                  type="number"
                  placeholder="Min amount"
                  value={filters.minPayment}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPayment: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="rating">Min Rating</Label>
                <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Jobs Grid */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>{t('recommended_jobs')} ({filteredJobs.length})</CardTitle>
            <CardDescription>Jobs matching your profile and filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const status = getJobStatus(job.id);
                return (
                  <div key={job.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white" onClick={() => handleJobSelect(job)}>
                    {/* Job Tags at the top */}
                    <div className="p-3 pb-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-medium">
                            {getJobTagIcon(tag)}
                            <span className="ml-1">{getJobTagLabel(tag)}</span>
                          </Badge>
                        ))}
                        {job.skillMatch && (
                          <Badge variant="secondary" className="text-xs font-medium bg-green-100 text-green-800">
                            <Award className="w-3 h-3 mr-1" />
                            {job.skillMatch}% Match
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-3 pt-0 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">₹{job.payment.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{job.paymentType}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {job.rating}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span><Users className="w-4 h-4 inline mr-1" />{job.applicants} applied</span>
                        </div>
                        <Badge variant={
                          status === 'completed' ? 'default' :
                          status === 'inProgress' ? 'secondary' :
                          status === 'applied' ? 'outline' : 'destructive'
                        }>
                          {status === 'completed' ? 'Completed' :
                           status === 'inProgress' ? 'In Progress' :
                           status === 'applied' ? t('applied') : 'Available'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* My Applications Section */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t('my_applications')}
            </CardTitle>
            <CardDescription>Track your job applications and their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sampleData.jobApplicationProgress.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                  <p>You haven't applied to any jobs yet. Start browsing jobs above!</p>
                </div>
              ) : (
                sampleData.jobApplicationProgress.map((app) => (
                  <Card key={app.jobId} className="border shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {app.jobTitle}
                            {appliedJobs.includes(app.jobId) && (
                              <Badge variant="outline" className="text-xs">
                                Applied
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-gray-600 mb-2">{app.company}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                            {app.salary && (
                              <span>Salary: ₹{app.salary.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appliedJobs.includes(app.jobId) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelApplication(app.jobId)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Cancel Application
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3 text-sm">Application Progress</h4>
                          <JobProgressBar
                            stages={app.stages}
                            currentStage={app.currentStage}
                          />
                        </div>
                        
                        {app.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium mb-1 text-blue-900 text-sm">Latest Update</h4>
                            <p className="text-sm text-blue-800">{app.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Details Dialog */}
        <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <DialogDescription>{selectedJob?.company}</DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{selectedJob.payment.toLocaleString()} {selectedJob.paymentType}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedJob.location}
                    </Badge>
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      {selectedJob.rating}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t('job_description')}</h4>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Tools Required</h4>
                  <p className="text-gray-600">{selectedJob.tools}</p>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    {selectedJob.applicants} applicants • {selectedJob.recruited} recruited
                  </div>
                  {!appliedJobs.includes(selectedJob.id) && (
                    <Button onClick={() => handleApplyJob(selectedJob.id)}>
                      {t('apply_now')}
                    </Button>
                  )}
                  {appliedJobs.includes(selectedJob.id) && (
                    <Button variant="outline" onClick={() => handleCancelApplication(selectedJob.id)}>
                      Cancel Application
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Stats Modal for Job Lists */}
        <Dialog open={showApplicationsModal} onOpenChange={setShowApplicationsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {applicationsModalType === 'applied' && `${t('jobs_applied')} (${stats.applied})`}
                {applicationsModalType === 'completed' && `${t('jobs_completed')} (${stats.completed})`}
                {applicationsModalType === 'inProgress' && `${t('jobs_in_progress')} (${stats.inProgress})`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {getJobsForStatsModal(applicationsModalType).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-lg font-medium mb-2">No jobs found</div>
                  <p>
                    {applicationsModalType === 'applied' && "You haven't applied to any jobs yet."}
                    {applicationsModalType === 'completed' && "You haven't completed any jobs yet."}
                    {applicationsModalType === 'inProgress' && "You don't have any jobs in progress."}
                  </p>
                </div>
              ) : (
                getJobsForStatsModal(applicationsModalType).map((job) => (
                  <Card key={job.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {job.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {job.rating}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600 mb-2">
                            ₹{job.payment.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">{job.paymentType}</div>
                          <Badge 
                            variant={
                              applicationsModalType === 'completed' ? 'default' :
                              applicationsModalType === 'inProgress' ? 'secondary' : 'outline'
                            }
                            className="mt-2"
                          >
                            {applicationsModalType === 'completed' ? 'Completed' :
                             applicationsModalType === 'inProgress' ? 'In Progress' : 'Applied'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
