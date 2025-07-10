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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Eye, Edit, Trash, MapPin, Clock, Users, Star, CheckCircle, XCircle, DollarSign, Award, Phone, Mail } from 'lucide-react';
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
}

const JobProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Sample data for jobs with more details
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
      status: 'completed',
      applicants: 15,
      shortlisted: 4
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJobForCandidates, setSelectedJobForCandidates] = useState<Job | null>(null);
  const [selectedJobForCompletion, setSelectedJobForCompletion] = useState<Job | null>(null);
  const [showStatsModal, setShowStatsModal] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workType: '',
    toolsRequired: '',
    location: '',
    salary: '',
    paymentType: 'hourly'
  });

  // Sample candidates data
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
        applied: '2024-01-15'
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
        applied: '2024-01-16'
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
        applied: '2024-01-17'
      }
    ];
    return candidates;
  };

  const handleInputChange = (field: string, value: string) => {
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
    toast({
      title: "Success",
      description: "Job posted successfully!",
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
    toast({
      title: "Success",
      description: "Job updated successfully!",
    });
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
    toast({
      title: "Job Completed",
      description: `Job "${job.title}" has been marked as completed. Payment initiated.`,
    });
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'active').length,
    completedJobs: jobs.filter(job => job.status === 'completed').length
  };

  const getStatsModalData = (type: string) => {
    switch (type) {
      case 'total':
        return jobs;
      case 'active':
        return jobs.filter(job => job.status === 'active');
      case 'completed':
        return jobs.filter(job => job.status === 'completed');
      default:
        return [];
    }
  };

  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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
                <div key={job.id} className="border rounded-lg p-4 bg-white">
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
                        <Badge variant={job.status === 'active' ? 'default' : job.status === 'completed' ? 'secondary' : 'outline'}>
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
                      <span><Users className="w-4 h-4 inline mr-1" />{job.applicants || 0} applicants</span>
                      <span><Star className="w-4 h-4 inline mr-1" />{job.shortlisted || 0} shortlisted</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedJobForCandidates(job)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Candidates
                      </Button>
                      {job.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEditJob(job)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedJobForCompletion(job)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        </>
                      )}
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Candidates for "{selectedJobForCandidates?.title}"</DialogTitle>
            <DialogDescription>
              Review and manage candidates who applied for this position
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedJobForCandidates && getCandidatesForJob(selectedJobForCandidates.id).map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{candidate.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{candidate.rating}</span>
                      </div>
                      <Badge variant="outline">{candidate.experience}</Badge>
                      <Badge className={getFitColor(candidate.fit)}>{candidate.fit} fit</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    Applied: {candidate.applied}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-sm">{candidate.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contact</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3" />
                      <span>{candidate.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Skills</p>
                  <div className="flex gap-1 flex-wrap">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="default">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Select
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
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
    </div>
  );
};

export default JobProviderDashboard;
