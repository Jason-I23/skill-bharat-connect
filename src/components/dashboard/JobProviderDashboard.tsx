
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Briefcase, Plus, Users, CheckCircle, Clock, IndianRupee, MapPin, Calendar, Star, Eye, UserCheck, UserX, FileText, Send, Award, TrendingUp, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from '../ui/use-toast';
import sampleData from '../../data/sampleData.json';
import newUserData from '../../data/newUserSampleData.json';

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
  status: string;
  applicants: number;
  shortlisted: number;
  recruited: number;
  skills: string[];
  tools: string;
  tags: string[];
  candidatesRequired?: number;
  estimatedEndDate?: string;
  insuranceAvailable?: boolean;
}

const JobProviderDashboard: React.FC = () => {
  const { user, setUserAsExisting } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateJobDialog, setShowCreateJobDialog] = useState(false);
  const [showJobDetailsDialog, setShowJobDetailsDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCandidatesDialog, setCandidatesDialog] = useState(false);
  const [showCompletedJobsDialog, setShowCompletedJobsDialog] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [candidateRating, setCandidateRating] = useState(5);
  const [completedJobToRate, setCompletedJobToRate] = useState<Job | null>(null);
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, 'applied' | 'selected' | 'offer_sent' | 'documents_requested'>>({});
  const [showReactivateJobs, setShowReactivateJobs] = useState(false);
  
  // Determine if user is new and load appropriate data
  const isNewUser = user?.isNewUser === true;
  const userData = isNewUser ? newUserData.newJobProvider : sampleData;

  const [formData, setFormData] = useState({
    title: '',
    company: user?.name || '',
    location: '',
    workType: '',
    description: '',
    requirements: '',
    salary: '',
    paymentType: 'monthly',
    type: 'full-time',
    skills: '',
    tools: '',
    candidatesRequired: 1,
    estimatedEndDate: '',
    insuranceAvailable: false
  });

  // Initialize jobs based on user type
  const [jobs, setJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    if (isNewUser) {
      setJobs([]);
    } else {
      setJobs(sampleData.jobs.filter(job => job.company === user?.name) || []);
    }
  }, [isNewUser, user?.name]);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'active').length,
    completedJobs: jobs.filter(job => job.status === 'completed').length,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0)
  };

  const profile = isNewUser ? userData.profile : {
    name: user?.name || '',
    company: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    verified: true,
    rating: 4.5,
    jobsPosted: jobs.length,
    jobsCompleted: jobs.filter(job => job.status === 'completed').length,
    paymentRating: 4.8,
    creditworthiness: 85
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.location || !formData.workType || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newJob: Job = {
      id: `job_${Date.now()}`,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      workType: formData.workType,
      description: formData.description,
      requirements: formData.requirements.split(',').map(req => req.trim()),
      salary: formData.salary,
      paymentType: formData.paymentType,
      payment: parseInt(formData.salary) || 0,
      type: formData.type,
      status: 'active',
      applicants: 0,
      shortlisted: 0,
      recruited: 0,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      tools: formData.tools,
      tags: ['new_job'],
      candidatesRequired: formData.candidatesRequired,
      estimatedEndDate: formData.estimatedEndDate,
      insuranceAvailable: formData.insuranceAvailable
    };

    setJobs(prev => [...prev, newJob]);
    
    if (isNewUser) {
      setUserAsExisting();
    }

    toast({
      title: "Success",
      description: "Job created successfully!",
      className: "bg-green-500 text-white border-green-600",
    });

    setShowCreateJobDialog(false);
    setFormData({
      title: '',
      company: user?.name || '',
      location: '',
      workType: '',
      description: '',
      requirements: '',
      salary: '',
      paymentType: 'monthly',
      type: 'full-time',
      skills: '',
      tools: '',
      candidatesRequired: 1,
      estimatedEndDate: '',
      insuranceAvailable: false
    });
  };

  const handleJobAction = (jobId: string, action: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: action === 'pause' ? 'paused' : action === 'activate' ? 'active' : job.status }
        : job
    ));

    const actionMessages = {
      pause: "Job paused successfully!",
      activate: "Job activated successfully!",
      delete: "Job deleted successfully!"
    };

    toast({
      title: "Success",
      description: actionMessages[action as keyof typeof actionMessages],
      className: "bg-green-500 text-white border-green-600",
    });
  };

  const handleCompleteJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'completed' } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setCompletedJobToRate(job);
      setShowRatingModal(true);
    }
  };

  const handleRatingSubmit = () => {
    toast({
      title: "Success",
      description: `Rating submitted: ${candidateRating} stars`,
      className: "bg-green-500 text-white border-green-600",
    });
    setShowRatingModal(false);
    setCompletedJobToRate(null);
    setCandidateRating(5);
  };

  const handleCandidateAction = (jobId: string, candidateId: string, action: 'applied' | 'selected' | 'offer_sent' | 'documents_requested') => {
    const key = `${jobId}_${candidateId}`;
    setCandidateStatuses(prev => ({ ...prev, [key]: action }));
    
    const actionMessages = {
      selected: "Candidate selected successfully!",
      offer_sent: "Job offer sent to candidate!",
      documents_requested: "Document request sent to candidate!"
    };
    
    toast({
      title: "Action Completed",
      description: actionMessages[action] || "Action completed successfully!",
      className: "bg-green-500 text-white border-green-600",
    });
  };

  const getCandidateStatus = (jobId: string, candidateId: string) => {
    const key = `${jobId}_${candidateId}`;
    return candidateStatuses[key] || 'applied';
  };

  const getButtonText = (jobId: string, candidateId: string, action: string) => {
    const status = getCandidateStatus(jobId, candidateId);
    
    if (action === 'select') {
      switch (status) {
        case 'selected': return 'Send Job Offer';
        case 'offer_sent': return 'Job Offer Sent';
        default: return 'Select Candidate';
      }
    } else if (action === 'document') {
      return status === 'documents_requested' ? 'Documents Requested' : 'Request Documents';
    }
    
    return 'Action';
  };

  const getButtonDisabled = (jobId: string, candidateId: string, action: string) => {
    const status = getCandidateStatus(jobId, candidateId);
    
    if (action === 'select' && status === 'offer_sent') return true;
    if (action === 'document' && status === 'documents_requested') return true;
    
    return false;
  };

  const handleReactivateJob = (completedJobId: string) => {
    const completedJob = sampleData.completedJobs?.find(job => job.id === completedJobId);
    if (completedJob) {
      const reactivatedJob: Job = {
        ...completedJob,
        id: `job_${Date.now()}`,
        status: 'active',
        applicants: 0,
        shortlisted: 0,
        recruited: 0
      };
      
      setJobs(prev => [...prev, reactivatedJob]);
      toast({
        title: "Success",
        description: "Job reactivated successfully!",
        className: "bg-green-500 text-white border-green-600",
      });
    }
    setShowReactivateJobs(false);
  };

  // Enhanced candidate data with more candidates per fit category
  const getCandidatesForJob = (jobId: string) => {
    const baseCandidates = isNewUser ? [] : (sampleData.candidates || []);
    
    return {
      excellent: baseCandidates.filter((c: any) => c.fit === 'excellent').slice(0, 6),
      good: baseCandidates.filter((c: any) => c.fit === 'good').slice(0, 8),
      poor: baseCandidates.filter((c: any) => c.fit === 'poor').slice(0, 4)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">
            {isNewUser ? `Welcome to your business dashboard, ${user?.name}!` : `${t('welcome') || 'Welcome'}, ${user?.name}!`}
          </h1>
          {isNewUser && (
            <p className="mt-2 text-green-100">Start by creating your first job posting!</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <div className="text-sm text-gray-600">Completed Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{stats.totalApplicants}</div>
              <div className="text-sm text-gray-600">Total Applicants</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  My Jobs ({jobs.length})
                </CardTitle>
                <Dialog open={showCreateJobDialog} onOpenChange={setShowCreateJobDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Job</DialogTitle>
                      <DialogDescription>Fill in the details to create a new job posting</DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic">Basic Details</TabsTrigger>
                        <TabsTrigger value="reactivate">Reactivate Jobs</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              placeholder="Enter job title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              placeholder="Company name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location *</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              placeholder="Job location"
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
                                <SelectItem value="electrical">Electrical</SelectItem>
                                <SelectItem value="carpentry">Carpentry</SelectItem>
                                <SelectItem value="painting">Painting</SelectItem>
                                <SelectItem value="construction">Construction</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="salary">Salary *</Label>
                            <Input
                              id="salary"
                              type="number"
                              value={formData.salary}
                              onChange={(e) => handleInputChange('salary', e.target.value)}
                              placeholder="Enter salary amount"
                            />
                          </div>
                          <div>
                            <Label htmlFor="paymentType">Payment Type</Label>
                            <Select value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value)}>
                              <SelectTrigger>
                                <SelectValue />
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
                            <Label htmlFor="candidatesRequired">Candidates Required</Label>
                            <Input
                              id="candidatesRequired"
                              type="number"
                              min="1"
                              value={formData.candidatesRequired}
                              onChange={(e) => handleInputChange('candidatesRequired', parseInt(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
                            <Input
                              id="estimatedEndDate"
                              type="date"
                              value={formData.estimatedEndDate}
                              onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Job Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe the job requirements and responsibilities"
                            className="min-h-[100px]"
                          />
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
                          <Button onClick={handleCreateJob} className="bg-green-600 hover:bg-green-700">
                            Create Job
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateJobDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="reactivate" className="space-y-4">
                        {!isNewUser && sampleData.completedJobs && sampleData.completedJobs.length > 0 ? (
                          <div className="space-y-4">
                            <h3 className="font-medium">Previously Completed Jobs</h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                              {sampleData.completedJobs.map((job: any) => (
                                <Card key={job.id} className="border">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{job.title}</h4>
                                        <p className="text-sm text-gray-600">{job.location}</p>
                                        <p className="text-sm text-green-600">₹{job.payment.toLocaleString()} {job.paymentType}</p>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => handleReactivateJob(job.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Reactivate
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">No Completed Jobs</h3>
                            <p>You don't have any completed jobs to reactivate yet.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No Jobs Posted Yet</h3>
                    <p>Create your first job posting to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Card key={job.id} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  {job.payment.toLocaleString()} {job.paymentType}
                                </span>
                                {job.candidatesRequired && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {job.candidatesRequired} candidates needed
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge variant={
                              job.status === 'active' ? 'default' :
                              job.status === 'paused' ? 'secondary' : 'outline'
                            }>
                              {job.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mb-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              {job.applicants} applied
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {job.shortlisted} shortlisted
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-4 h-4 text-purple-600" />
                              {job.recruited} recruited
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedJob(job);
                                setCandidatesDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Candidates
                            </Button>
                            
                            {job.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleJobAction(job.id, 'pause')}
                              >
                                Pause
                              </Button>
                            )}
                            
                            {job.status === 'paused' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleJobAction(job.id, 'activate')}
                              >
                                Activate
                              </Button>
                            )}
                            
                            {job.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCompleteJob(job.id)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                Complete & Pay
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Card */}
          <div>
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{profile.name}</h3>
                  <p className="text-sm text-gray-600">{profile.company}</p>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
                
                {!isNewUser && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Verified Provider</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{profile.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Jobs Posted</span>
                        <span>{profile.jobsPosted}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Jobs Completed</span>
                        <span>{profile.jobsCompleted}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Payment Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{profile.paymentRating}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Creditworthiness</span>
                        <span>{profile.creditworthiness}%</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Candidates Dialog */}
        <Dialog open={showCandidatesDialog} onOpenChange={setCandidatesDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidates for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Review and manage candidates who applied for this position
              </DialogDescription>
            </DialogHeader>
            
            {selectedJob && (
              <Tabs defaultValue="excellent" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="excellent" className="text-green-700">
                    Excellent Fit ({getCandidatesForJob(selectedJob.id).excellent.length})
                  </TabsTrigger>
                  <TabsTrigger value="good" className="text-blue-700">
                    Good Fit ({getCandidatesForJob(selectedJob.id).good.length})
                  </TabsTrigger>
                  <TabsTrigger value="poor" className="text-red-700">
                    Poor Fit ({getCandidatesForJob(selectedJob.id).poor.length})
                  </TabsTrigger>
                </TabsList>
                
                {['excellent', 'good', 'poor'].map((fitLevel) => (
                  <TabsContent key={fitLevel} value={fitLevel} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getCandidatesForJob(selectedJob.id)[fitLevel as keyof ReturnType<typeof getCandidatesForJob>].map((candidate: any) => (
                        <Card key={candidate.id} className={`border-2 ${
                          fitLevel === 'excellent' ? 'border-green-200 bg-green-50' :
                          fitLevel === 'good' ? 'border-blue-200 bg-blue-50' :
                          'border-red-200 bg-red-50'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{candidate.name}</h4>
                                <p className="text-sm text-gray-600">{candidate.location}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm">{candidate.rating}</span>
                                </div>
                              </div>
                              <Badge variant={
                                fitLevel === 'excellent' ? 'default' :
                                fitLevel === 'good' ? 'secondary' : 'destructive'
                              }>
                                {fitLevel === 'excellent' ? 'Excellent' :
                                 fitLevel === 'good' ? 'Good' : 'Poor'} Fit
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="text-sm">
                                <span className="font-medium">Experience:</span> {candidate.experience}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Skills:</span> {candidate.skills.join(', ')}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Expected Salary:</span> ₹{candidate.expectedSalary?.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  const currentStatus = getCandidateStatus(selectedJob.id, candidate.id);
                                  if (currentStatus === 'applied') {
                                    handleCandidateAction(selectedJob.id, candidate.id, 'selected');
                                  } else if (currentStatus === 'selected') {
                                    handleCandidateAction(selectedJob.id, candidate.id, 'offer_sent');
                                  }
                                }}
                                disabled={getButtonDisabled(selectedJob.id, candidate.id, 'select')}
                              >
                                {getButtonText(selectedJob.id, candidate.id, 'select')}
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleCandidateAction(selectedJob.id, candidate.id, 'documents_requested')}
                                disabled={getButtonDisabled(selectedJob.id, candidate.id, 'document')}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                {getButtonText(selectedJob.id, candidate.id, 'document')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Rating Modal */}
        <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate the Candidate</DialogTitle>
              <DialogDescription>
                How would you rate the candidate's performance for {completedJobToRate?.title}?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label>Rating:</Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCandidateRating(star)}
                      className={`p-1 ${star <= candidateRating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({candidateRating} stars)</span>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleRatingSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit Rating
                </Button>
                <Button variant="outline" onClick={() => setShowRatingModal(false)}>
                  Skip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobProviderDashboard;
