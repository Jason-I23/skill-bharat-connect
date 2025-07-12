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
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Eye, Edit, Trash, MapPin, Clock, Users, Star, CheckCircle, DollarSign, Award, Phone, Mail, FileText, Shield, Calendar, UserCheck } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
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
  candidatesRequired: number;
  estimatedEndDate: string;
  insuranceAvailable: boolean;
  status: 'active' | 'paused' | 'completed';
  applicants?: number;
  shortlisted?: number;
}

interface Candidate {
  id: string;
  name: string;
  rating: number;
  experience: string;
  location: string;
  skills: string[];
  phone: string;
  email: string;
  fit: 'excellent' | 'good' | 'poor';
  applied: string;
  status: 'applied' | 'selected' | 'offer_sent' | 'documents_requested';
  providerRating?: number;
}

const JobProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'job_1',
      title: 'Residential Plumber',
      description: 'Fix leaking pipes and install new plumbing fixtures in residential properties. Experience required in pipe fitting and basic plumbing repairs.',
      workType: 'plumbing',
      toolsRequired: 'Pipe wrench, soldering kit, measuring tape',
      location: 'Chennai, Tamil Nadu',
      salary: '15000',
      paymentType: 'monthly',
      candidatesRequired: 2,
      estimatedEndDate: '2024-02-15',
      insuranceAvailable: true,
      status: 'active',
      applicants: 12,
      shortlisted: 3
    },
    {
      id: 'job_2',
      title: 'Electrical Maintenance',
      description: 'Maintain and repair electrical systems in commercial buildings. Must be familiar with safety protocols.',
      workType: 'electrical',
      toolsRequired: 'Multimeter, wire strippers, electrical tester',
      location: 'Bangalore, Karnataka',
      salary: '25000',
      paymentType: 'monthly',
      candidatesRequired: 1,
      estimatedEndDate: '2024-03-01',
      insuranceAvailable: false,
      status: 'active',
      applicants: 8,
      shortlisted: 2
    },
    {
      id: 'job_3',
      title: 'Furniture Carpenter',
      description: 'Create custom furniture and repair wooden structures for residential clients.',
      workType: 'carpentry',
      toolsRequired: 'Saw, hammer, chisel, measuring tools',
      location: 'Mumbai, Maharashtra',
      salary: '800',
      paymentType: 'daily',
      candidatesRequired: 3,
      estimatedEndDate: '2024-01-30',
      insuranceAvailable: true,
      status: 'completed',
      applicants: 15,
      shortlisted: 4
    }
  ]);

  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJobForCandidates, setSelectedJobForCandidates] = useState<Job | null>(null);
  const [selectedJobForCompletion, setSelectedJobForCompletion] = useState<Job | null>(null);
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<Candidate | null>(null);
  const [showStatsModal, setShowStatsModal] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [candidateRating, setCandidateRating] = useState(5);
  const [completedJobToRate, setCompletedJobToRate] = useState<Job | null>(null);
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workType: '',
    toolsRequired: '',
    location: '',
    salary: '',
    paymentType: 'hourly',
    candidatesRequired: 1,
    estimatedEndDate: '',
    insuranceAvailable: false
  });

  // Sample completed jobs for reactivation
  const completedJobsForReactivation = [
    {
      id: 'completed_1',
      title: 'Kitchen Renovation Plumber',
      description: 'Complete plumbing work for kitchen renovation project',
      workType: 'plumbing',
      location: 'Delhi, India',
      salary: '18000',
      paymentType: 'monthly',
      completedDate: '2024-01-10'
    },
    {
      id: 'completed_2',
      title: 'Office Electrical Setup',
      description: 'Electrical wiring and setup for new office space',
      workType: 'electrical',
      location: 'Mumbai, Maharashtra',
      salary: '22000',
      paymentType: 'fixed',
      completedDate: '2024-01-05'
    }
  ];

  // Get candidates with their current status
  const getCandidatesForJob = (jobId: string): Candidate[] => {
    const candidates: Candidate[] = [
      {
        id: 'c1',
        name: 'Rajesh Kumar',
        rating: 4.8,
        experience: '5 years',
        location: 'Chennai, Tamil Nadu',
        skills: ['Plumbing', 'Pipe Fitting', 'Water Systems'],
        phone: '9876543210',
        email: 'rajesh.kumar@email.com',
        fit: 'excellent',
        applied: '2024-01-15',
        status: candidateStatuses[`${jobId}_c1`] || 'applied'
      },
      {
        id: 'c2',
        name: 'Amit Sharma',
        rating: 4.5,
        experience: '3 years',
        location: 'Chennai, Tamil Nadu',
        skills: ['Plumbing', 'Electrical Work'],
        phone: '9123456789',
        email: 'amit.sharma@email.com',
        fit: 'good',
        applied: '2024-01-16',
        status: candidateStatuses[`${jobId}_c2`] || 'applied'
      },
      {
        id: 'c3',
        name: 'Suresh Patel',
        rating: 3.2,
        experience: '1 year',
        location: 'Coimbatore, Tamil Nadu',
        skills: ['Basic Plumbing'],
        phone: '9988776655',
        email: 'suresh.patel@email.com',
        fit: 'poor',
        applied: '2024-01-17',
        status: candidateStatuses[`${jobId}_c3`] || 'applied'
      }
    ];
    return candidates;
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateJob = () => {
    const newJob: Job = {
      id: 'job_' + Date.now(),
      ...formData,
      status: 'active',
      applicants: 0,
      shortlisted: 0
    };
    setJobs([newJob, ...jobs]);
    resetForm();
    setShowCreateJobModal(false);
    toast({
      title: "Success",
      description: "Job posted successfully!",
    });
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;
    
    setJobs(jobs.map(job => 
      job.id === editingJob.id 
        ? { ...job, ...formData }
        : job
    ));
    setEditingJob(null);
    setShowCreateJobModal(false);
    resetForm();
    toast({
      title: "Success",
      description: "Job updated successfully!",
    });
  };

  const handleReactivateJob = (completedJob: any) => {
    const reactivatedJob: Job = {
      id: 'job_' + Date.now(),
      title: completedJob.title,
      description: completedJob.description,
      workType: completedJob.workType,
      toolsRequired: 'Standard tools required',
      location: completedJob.location,
      salary: completedJob.salary,
      paymentType: completedJob.paymentType,
      candidatesRequired: 1,
      estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      insuranceAvailable: false,
      status: 'active',
      applicants: 0,
      shortlisted: 0
    };
    
    setJobs([reactivatedJob, ...jobs]);
    setShowReactivateModal(false);
    toast({
      title: "Job Reactivated",
      description: `"${completedJob.title}" has been reactivated and is now live.`,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      workType: '',
      toolsRequired: '',
      location: '',
      salary: '',
      paymentType: 'hourly',
      candidatesRequired: 1,
      estimatedEndDate: '',
      insuranceAvailable: false
    });
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
      paymentType: job.paymentType,
      candidatesRequired: job.candidatesRequired,
      estimatedEndDate: job.estimatedEndDate,
      insuranceAvailable: job.insuranceAvailable
    });
    setShowCreateJobModal(true);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    toast({
      title: "Success",
      description: "Job deleted successfully!",
    });
  };

  const handleCompleteJob = (job: Job) => {
    setJobs(jobs.map(j => 
      j.id === job.id 
        ? { ...j, status: 'completed' as const }
        : j
    ));
    setSelectedJobForCompletion(null);
    setCompletedJobToRate(job);
    setShowRatingModal(true);
  };

  const handleRateCandidate = () => {
    toast({
      title: "Rating Submitted",
      description: `Candidate rated ${candidateRating} stars. Payment has been processed.`,
    });
    setShowRatingModal(false);
    setCompletedJobToRate(null);
    setCandidateRating(5);
  };

  const handleCandidateAction = (jobId: string, candidateId: string, action: string) => {
    const key = `${jobId}_${candidateId}`;
    setCandidateStatuses(prev => ({ ...prev, [key]: action }));
    
    const actionMessages = {
      'selected': 'Candidate selected successfully!',
      'offer_sent': 'Job offer sent to candidate!',
      'documents_requested': 'Document request sent to candidate!'
    };
    
    toast({
      title: "Action Completed",
      description: actionMessages[action as keyof typeof actionMessages] || "Action completed successfully!",
    });
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'active').length,
    completedJobs: jobs.filter(job => job.status === 'completed').length
  };

  const getStatsModalData = (type: string) => {
    switch (type) {
      case 'total': return jobs;
      case 'active': return jobs.filter(job => job.status === 'active');
      case 'completed': return jobs.filter(job => job.status === 'completed');
      default: return [];
    }
  };

  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFitEmphasis = (fit: string) => {
    switch (fit) {
      case 'excellent': return 'ring-2 ring-green-300 shadow-lg transform scale-105';
      case 'good': return 'ring-1 ring-blue-200 shadow-md';
      case 'poor': return 'opacity-75';
      default: return '';
    }
  };

  const getButtonText = (status: string, action: 'select' | 'document') => {
    if (action === 'select') {
      switch (status) {
        case 'selected': return 'Send Job Offer';
        case 'offer_sent': return 'Job Offer Sent';
        default: return 'Select Candidate';
      }
    } else {
      switch (status) {
        case 'documents_requested': return 'Documents Requested';
        default: return 'Request Documents';
      }
    }
  };

  const handleViewCandidateProfile = (candidate: Candidate) => {
    setSelectedCandidateProfile(candidate);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{t('welcome')}, {user?.name}!</h1>
        <p className="opacity-90">Manage your jobs and find skilled professionals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowStatsModal('total')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
            <div className="text-sm text-gray-600">Total Jobs Posted</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowStatsModal('active')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowStatsModal('completed')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.completedJobs}</div>
            <div className="text-sm text-gray-600">Completed Jobs</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Posted Jobs ({jobs.length})</CardTitle>
              <CardDescription>Manage your active job postings</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReactivateModal(true)} className="w-full sm:w-auto">
                <CheckCircle className="w-4 h-4 mr-2" />
                Reactivate Jobs
              </Button>
              <Button onClick={() => setShowCreateJobModal(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No jobs posted yet</div>
              <p>Create your first job posting to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="border hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {job.paymentType}
                            </Badge>
                            <Badge variant={job.status === 'active' ? 'default' : job.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                              {job.status}
                            </Badge>
                            {job.insuranceAvailable && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Insured
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">₹{job.salary}</div>
                          <div className="text-xs text-gray-600">{job.paymentType}</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                      
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span><Users className="w-3 h-3 inline mr-1" />{job.applicants || 0} applicants</span>
                        <span><Star className="w-3 h-3 inline mr-1" />{job.shortlisted || 0} shortlisted</span>
                        <span><Calendar className="w-3 h-3 inline mr-1" />Need {job.candidatesRequired}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedJobForCandidates(job)} className="text-xs px-2 py-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View Candidates
                        </Button>
                        {job.status === 'active' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEditJob(job)} className="text-xs px-2 py-1">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedJobForCompletion(job)} className="text-xs px-2 py-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDeleteJob(job.id)} className="text-xs px-2 py-1">
                          <Trash className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Job Modal */}
      <Dialog open={showCreateJobModal} onOpenChange={setShowCreateJobModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update your job posting details' : 'Fill in the details to create a new job posting'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                <Label htmlFor="candidatesRequired">Candidates Required *</Label>
                <Input
                  id="candidatesRequired"
                  type="number"
                  min="1"
                  value={formData.candidatesRequired}
                  onChange={(e) => handleInputChange('candidatesRequired', parseInt(e.target.value) || 1)}
                  placeholder="Number of candidates needed"
                />
              </div>
              <div>
                <Label htmlFor="estimatedEndDate">Estimated End Date *</Label>
                <Input
                  id="estimatedEndDate"
                  type="date"
                  value={formData.estimatedEndDate}
                  onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
                />
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
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="insuranceAvailable"
                checked={formData.insuranceAvailable}
                onCheckedChange={(checked) => handleInputChange('insuranceAvailable', checked)}
              />
              <Label htmlFor="insuranceAvailable">Insurance Available</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={editingJob ? handleUpdateJob : handleCreateJob}>
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowCreateJobModal(false);
                setEditingJob(null);
                resetForm();
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reactivate Jobs Modal */}
      <Dialog open={showReactivateModal} onOpenChange={setShowReactivateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reactivate Completed Jobs</DialogTitle>
            <DialogDescription>
              Select a completed job to reactivate and post again
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedJobsForReactivation.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{job.title}</h4>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span>{job.location}</span> • <span>₹{job.salary} ({job.paymentType})</span>
                  </div>
                  <Button size="sm" onClick={() => handleReactivateJob(job)}>
                    Reactivate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Modal */}
      <Dialog open={!!showStatsModal} onOpenChange={() => setShowStatsModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showStatsModal === 'total' && 'All Jobs'}
              {showStatsModal === 'active' && 'Active Jobs'}
              {showStatsModal === 'completed' && 'Completed Jobs'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getStatsModalData(showStatsModal || '').map((job) => (
              <div key={job.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{job.title}</h4>
                  <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.location}</p>
                <div className="flex justify-between text-sm">
                  <span>₹{job.salary} ({job.paymentType})</span>
                  <span>{job.applicants || 0} applicants</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidates Modal */}
      <Dialog open={!!selectedJobForCandidates} onOpenChange={() => setSelectedJobForCandidates(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Candidates for "{selectedJobForCandidates?.title}"</DialogTitle>
            <DialogDescription>
              Review and manage candidates who applied for this position
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {selectedJobForCandidates && getCandidatesForJob(selectedJobForCandidates.id).map((candidate) => (
              <div key={candidate.id} className={`border rounded-lg p-4 ${getFitColor(candidate.fit)} ${getFitEmphasis(candidate.fit)} transition-all`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{candidate.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{candidate.rating}</span>
                      </div>
                      <Badge variant="outline">{candidate.experience}</Badge>
                      <Badge className={`text-xs font-bold ${
                        candidate.fit === 'excellent' ? 'bg-green-600 text-white' :
                        candidate.fit === 'good' ? 'bg-blue-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {candidate.fit.toUpperCase()} FIT
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="text-sm">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {candidate.location}
                  </div>
                  <div className="text-sm">
                    <Phone className="w-3 h-3 inline mr-1" />
                    {candidate.phone}
                  </div>
                  <div className="text-sm">
                    <Mail className="w-3 h-3 inline mr-1" />
                    {candidate.email}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex gap-1 flex-wrap">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    variant={candidate.status === 'offer_sent' ? 'secondary' : 'default'}
                    disabled={candidate.status === 'offer_sent'}
                    onClick={() => {
                      const nextStatus = candidate.status === 'applied' ? 'selected' : 
                                       candidate.status === 'selected' ? 'offer_sent' : candidate.status;
                      handleCandidateAction(selectedJobForCandidates.id, candidate.id, nextStatus);
                    }}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {getButtonText(candidate.status, 'select')}
                  </Button>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewCandidateProfile(candidate)}
                      className="flex-1 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Profile
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={candidate.status === 'documents_requested'}
                      onClick={() => handleCandidateAction(selectedJobForCandidates.id, candidate.id, 'documents_requested')}
                      className="flex-1 text-xs"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {getButtonText(candidate.status, 'document')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Completion Modal */}
      <Dialog open={!!selectedJobForCompletion} onOpenChange={() => setSelectedJobForCompletion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Job</DialogTitle>
            <DialogDescription>
              Mark "{selectedJobForCompletion?.title}" as completed and initiate payment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Payment Details</span>
              </div>
              <p className="text-sm text-gray-600">
                Amount: ₹{selectedJobForCompletion?.salary} ({selectedJobForCompletion?.paymentType})
              </p>
              <p className="text-sm text-gray-600">
                This will initiate payment to the selected job seeker(s)
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => selectedJobForCompletion && handleCompleteJob(selectedJobForCompletion)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete & Pay
              </Button>
              <Button variant="outline" onClick={() => setSelectedJobForCompletion(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Candidate Performance</DialogTitle>
            <DialogDescription>
              Please rate the candidate's performance for "{completedJobToRate?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCandidateRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star className={`w-8 h-8 ${star <= candidateRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">Rating: {candidateRating} out of 5 stars</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleRateCandidate}>
                <Award className="w-4 h-4 mr-2" />
                Submit Rating
              </Button>
              <Button variant="outline" onClick={() => setShowRatingModal(false)}>
                Skip
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Profile Modal */}
      <Dialog open={!!selectedCandidateProfile} onOpenChange={() => setSelectedCandidateProfile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>
              Detailed profile information for {selectedCandidateProfile?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCandidateProfile && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {selectedCandidateProfile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedCandidateProfile.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedCandidateProfile.rating}</span>
                    </div>
                    <Badge variant="outline">{selectedCandidateProfile.experience}</Badge>
                    <Badge className={getFitColor(selectedCandidateProfile.fit)}>{selectedCandidateProfile.fit} fit</Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedCandidateProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedCandidateProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedCandidateProfile.location}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>Applied: {selectedCandidateProfile.applied}</div>
                    <div>Experience: {selectedCandidateProfile.experience}</div>
                    <div>Rating: {selectedCandidateProfile.rating}/5.0</div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold mb-2">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidateProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select Candidate
                </Button>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Document Request Sent",
                    description: "The candidate has been notified to submit verification documents.",
                  });
                }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Request Documents
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobProviderDashboard;
