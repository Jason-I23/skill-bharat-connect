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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckboxDropdown } from '../ui/checkbox-dropdown';
import { Briefcase, Plus, Eye, Edit, Trash2, Users, MapPin, IndianRupee, Clock, Star, CheckCircle, AlertCircle, UserCheck, FileText, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import sampleData from '../../data/sampleData.json';
import newUserData from '../../data/newUserData.json';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: string;
  description: string;
  requirements: string[];
  salary: string;
  paymentType: string;
  payment: number;
  type: string;
  rating: number;
  applicants: number;
  shortlisted: number;
  recruited: number;
  skills: string[];
  tools: string;
  tags?: string[];
  providerId: string;
  status?: string;
  candidatesRequired?: number;
  completedDate?: string;
}

type CandidateStatus = "applied" | "selected" | "offer_sent" | "documents_requested";

const JobProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Use new user data if user is new, otherwise use existing data
  const userData = user?.isNewUser ? newUserData.newJobProvider : sampleData;
  const initialJobs = user?.isNewUser ? [] : sampleData.jobs;
  // Fix: Access candidates from the correct source
  const initialCandidates = user?.isNewUser ? [] : sampleData.candidates || [];
  
  // State management
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, CandidateStatus>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string[]>>({});
  
  // Form states
  const [jobForm, setJobForm] = useState({
    title: '',
    company: user?.name || '',
    location: '',
    workType: '',
    description: '',
    requirements: [] as string[],
    salary: '',
    paymentType: 'monthly' as string,
    type: 'full-time' as string,
    skills: [] as string[],
    tools: '',
    candidatesRequired: 1
  });
  const [requirementInput, setRequirementInput] = useState('');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showReactivateJobs, setShowReactivateJobs] = useState(false);

  // Get dashboard stats
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'active' || !job.status).length,
    completedJobs: jobs.filter(job => job.status === 'completed').length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)
  };

  // Get provider profile data
  const providerProfile = user?.isNewUser ? newUserData.newJobProvider.profile : {
    name: user?.name || '',
    company: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    verified: true,
    rating: 4.2,
    jobsPosted: jobs.length,
    jobsCompleted: stats.completedJobs,
    paymentRating: 4.5,
    creditworthiness: 85
  };

  // Get inactive jobs for reactivation
  const inactiveJobs = jobs.filter(job => job.status === 'completed' || job.status === 'inactive');

  // Form handlers
  const resetJobForm = () => {
    setJobForm({
      title: '',
      company: user?.name || '',
      location: '',
      workType: '',
      description: '',
      requirements: [],
      salary: '',
      paymentType: 'monthly',
      type: 'full-time',
      skills: [],
      tools: '',
      candidatesRequired: 1
    });
    setRequirementInput('');
    setEditingJob(null);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setJobForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setJobForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleCreateJob = () => {
    if (!jobForm.title || !jobForm.description || !jobForm.salary) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newJob: Job = {
      id: `job_${Date.now()}`,
      ...jobForm,
      payment: parseInt(jobForm.salary),
      rating: 0,
      applicants: 0,
      shortlisted: 0,
      recruited: 0,
      tags: ['new_posting'],
      providerId: user?.id || '',
      status: 'active'
    };

    if (editingJob) {
      setJobs(prev => prev.map(job => job.id === editingJob.id ? { ...newJob, id: editingJob.id } : job));
      toast.success('Job updated successfully!');
    } else {
      setJobs(prev => [...prev, newJob]);
      toast.success('Job posted successfully!');
    }

    setShowCreateJob(false);
    resetJobForm();
  };

  const handleReactivateJob = (jobId: string) => {
    const jobToReactivate = inactiveJobs.find(job => job.id === jobId);
    if (jobToReactivate) {
      // Pre-fill form with job data
      setJobForm({
        title: jobToReactivate.title,
        company: jobToReactivate.company,
        location: jobToReactivate.location,
        workType: jobToReactivate.workType,
        description: jobToReactivate.description,
        requirements: jobToReactivate.requirements,
        salary: jobToReactivate.salary,
        paymentType: jobToReactivate.paymentType,
        type: jobToReactivate.type,
        skills: jobToReactivate.skills,
        tools: jobToReactivate.tools,
        candidatesRequired: jobToReactivate.candidatesRequired || 1
      });
      setEditingJob({ ...jobToReactivate, status: 'active' });
      setShowReactivateJobs(false);
      setShowCreateJob(true);
    }
  };

  const handleEditJob = (job: Job) => {
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      workType: job.workType,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      paymentType: job.paymentType,
      type: job.type,
      skills: job.skills,
      tools: job.tools,
      candidatesRequired: job.candidatesRequired || 1
    });
    setEditingJob(job);
    setShowCreateJob(true);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    toast.success('Job deleted successfully!');
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleCandidateAction = (candidateId: string, action: CandidateStatus, jobId?: string) => {
    setCandidateStatuses(prev => ({
      ...prev,
      [candidateId]: action
    }));

    // Persist selection when moving between states
    if (jobId && action === "selected") {
      setSelectedCandidates(prev => ({
        ...prev,
        [jobId]: [...(prev[jobId] || []), candidateId]
      }));
    }

    const actionMessages = {
      selected: 'Candidate shortlisted',
      offer_sent: 'Job offer sent to candidate',
      documents_requested: 'Document verification requested'
    };

    if (action !== 'applied') {
      toast.success(actionMessages[action]);
    }
  };

  const getCandidatesForJob = (jobId: string) => {
    if (user?.isNewUser) return [];
    return initialCandidates.filter(candidate => 
      candidate.appliedJobs?.includes(jobId)
    );
  };

  const getCandidatesByFit = (jobId: string) => {
    const candidates = getCandidatesForJob(jobId);
    const highFit = candidates.filter(c => c.skillMatch >= 80);
    const mediumFit = candidates.filter(c => c.skillMatch >= 60 && c.skillMatch < 80);
    const lowFit = candidates.filter(c => c.skillMatch < 60);
    
    return { highFit, mediumFit, lowFit };
  };

  const renderCandidateCard = (candidate: any, jobId: string) => {
    const status = candidateStatuses[candidate.id] || "applied";
    const isSelected = selectedCandidates[jobId]?.includes(candidate.id);
    
    return (
      <Card key={candidate.id} className={`p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">{candidate.name}</h4>
            <p className="text-sm text-gray-600">{candidate.location}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {candidate.skillMatch}% Match
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {candidate.rating}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">₹{candidate.expectedSalary?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{candidate.salaryType}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1">
            {candidate.skills?.slice(0, 3).map((skill: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
            {candidate.skills?.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{candidate.skills.length - 3}</Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{candidate.bio}</p>
        </div>

        <div className="flex gap-2">
          {status === "applied" && (
            <Button
              size="sm"
              onClick={() => handleCandidateAction(candidate.id, "selected", jobId)}
              className="flex-1"
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Select
            </Button>
          )}
          {status === "selected" && (
            <>
              <Button
                size="sm"
                onClick={() => handleCandidateAction(candidate.id, "offer_sent", jobId)}
                className="flex-1"
              >
                Send Offer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCandidateAction(candidate.id, "documents_requested", jobId)}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </>
          )}
          {status === "offer_sent" && (
            <div className="flex-1 text-center">
              <Badge variant="default" className="text-xs">Offer Sent</Badge>
            </div>
          )}
          {status === "documents_requested" && (
            <div className="flex-1 text-center">
              <Badge variant="secondary" className="text-xs">Docs Requested</Badge>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{t('welcome')}, {user?.name}!</h1>
              {user?.isNewUser ? (
                <p className="mt-2 text-purple-100">Start by creating your first job posting to find the perfect candidates.</p>
              ) : (
                <p className="mt-2 text-purple-100">Manage your job postings and find the best candidates</p>
              )}
            </div>
            <Button 
              onClick={() => {
                resetJobForm();
                setShowCreateJob(true);
              }}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </CardContent>
          </Card>
        </div>

        {/* My Jobs Section */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                My Job Postings
              </CardTitle>
              <div className="flex gap-2">
                {!user?.isNewUser && inactiveJobs.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReactivateJobs(true)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reactivate Jobs
                  </Button>
                )}
                <Button
                  onClick={() => {
                    resetJobForm();
                    setShowCreateJob(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Job Postings Yet</h3>
                <p>Create your first job posting to start finding candidates!</p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    resetJobForm();
                    setShowCreateJob(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Job
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status || 'active'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-green-600">₹{job.payment.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{job.paymentType}</div>
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
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span><Users className="w-4 h-4 inline mr-1" />{job.applicants} applied</span>
                        <span><CheckCircle className="w-4 h-4 inline mr-1" />{job.shortlisted} selected</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleJobSelect(job)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditJob(job)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Job Dialog */}
        <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
              <DialogDescription>
                {editingJob ? 'Update your job posting details' : 'Fill in the details to create a new job posting'}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Job Details</TabsTrigger>
                {!user?.isNewUser && inactiveJobs.length > 0 && (
                  <TabsTrigger value="reactivate">Reactivate Job</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={jobForm.title}
                      onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Senior Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={jobForm.company}
                      onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <CheckboxDropdown
                      options={sampleData.districts}
                      selectedValues={jobForm.location ? [jobForm.location] : []}
                      onSelectionChange={(values) => setJobForm(prev => ({ ...prev, location: values[0] || '' }))}
                      placeholder="Select location"
                      className="w-full"
                      maxSelections={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workType">Work Type</Label>
                    <Select value={jobForm.workType} onValueChange={(value) => setJobForm(prev => ({ ...prev, workType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="data_entry">Data Entry</SelectItem>
                        <SelectItem value="customer_service">Customer Service</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={jobForm.description}
                    onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the job role, responsibilities, and expectations..."
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary">Salary/Payment *</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                      placeholder="Amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <Select value={jobForm.paymentType} onValueChange={(value) => setJobForm(prev => ({ ...prev, paymentType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Per Hour</SelectItem>
                        <SelectItem value="daily">Per Day</SelectItem>
                        <SelectItem value="weekly">Per Week</SelectItem>
                        <SelectItem value="monthly">Per Month</SelectItem>
                        <SelectItem value="fixed">Fixed Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <Select value={jobForm.type} onValueChange={(value) => setJobForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Skills Required</Label>
                  <CheckboxDropdown
                    options={sampleData.skillCategories}
                    selectedValues={jobForm.skills}
                    onSelectionChange={(values) => setJobForm(prev => ({ ...prev, skills: values }))}
                    placeholder="Select required skills"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="Add a requirement"
                        onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                      />
                      <Button type="button" onClick={addRequirement}>Add</Button>
                    </div>
                    <div className="space-y-1">
                      {jobForm.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{req}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tools">Tools/Equipment Provided</Label>
                  <Textarea
                    id="tools"
                    value={jobForm.tools}
                    onChange={(e) => setJobForm(prev => ({ ...prev, tools: e.target.value }))}
                    placeholder="List any tools, equipment, or resources provided..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="candidatesRequired">Number of Candidates Required</Label>
                  <Input
                    id="candidatesRequired"
                    type="number"
                    min="1"
                    value={jobForm.candidatesRequired}
                    onChange={(e) => setJobForm(prev => ({ ...prev, candidatesRequired: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </TabsContent>

              {!user?.isNewUser && inactiveJobs.length > 0 && (
                <TabsContent value="reactivate" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Reactivate Previous Jobs</h3>
                    <div className="grid gap-4">
                      {inactiveJobs.map((job) => (
                        <Card key={job.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                ₹{job.payment.toLocaleString()} {job.paymentType}
                              </p>
                              {job.completedDate && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Completed: {new Date(job.completedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleReactivateJob(job.id)}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reactivate
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setShowCreateJob(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob}>
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <DialogDescription>{selectedJob?.company} • {selectedJob?.location}</DialogDescription>
            </DialogHeader>
            
            {selectedJob && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="candidates">Candidates ({getCandidatesForJob(selectedJob.id).length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Job Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Payment:</strong> ₹{selectedJob.payment.toLocaleString()} {selectedJob.paymentType}</p>
                        <p><strong>Type:</strong> {selectedJob.type}</p>
                        <p><strong>Location:</strong> {selectedJob.location}</p>
                        <p><strong>Candidates Required:</strong> {selectedJob.candidatesRequired || 1}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Application Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">{selectedJob.applicants}</div>
                          <div className="text-sm text-gray-600">Applied</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">{selectedJob.shortlisted}</div>
                          <div className="text-sm text-gray-600">Selected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedJob.requirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="candidates" className="space-y-4">
                  {user?.isNewUser ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                      <p>Once candidates start applying, you'll see them here!</p>
                    </div>
                  ) : (
                    (() => {
                      const { highFit, mediumFit, lowFit } = getCandidatesByFit(selectedJob.id);
                      
                      if (highFit.length === 0 && mediumFit.length === 0 && lowFit.length === 0) {
                        return (
                          <div className="text-center py-12 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                            <p>Once candidates start applying, you'll see them here!</p>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="space-y-6">
                          {highFit.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-green-700">
                                High Fit Candidates ({highFit.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {highFit.map(candidate => renderCandidateCard(candidate, selectedJob.id))}
                              </div>
                            </div>
                          )}
                          
                          {mediumFit.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-yellow-700">
                                Medium Fit Candidates ({mediumFit.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mediumFit.map(candidate => renderCandidateCard(candidate, selectedJob.id))}
                              </div>
                            </div>
                          )}
                          
                          {lowFit.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-red-700">
                                Low Fit Candidates ({lowFit.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {lowFit.map(candidate => renderCandidateCard(candidate, selectedJob.id))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobProviderDashboard;
