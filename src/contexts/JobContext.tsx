
import React, { createContext, useContext, useState, ReactNode } from 'react';
import sampleData from '../data/sampleData.json';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  skills: string[];
  tools: string;
  payment: number;
  paymentType: string;
  type: string;
  rating: number;
  applicants: number;
  recruited: number;
  postedBy?: string;
  status?: 'active' | 'paused' | 'completed';
  datePosted?: string;
}

interface JobApplication {
  jobId: string;
  userId: string;
  status: 'applied' | 'inProgress' | 'completed' | 'cancelled';
  appliedDate: string;
  completedDate?: string;
}

interface JobContextType {
  jobs: Job[];
  applications: JobApplication[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyForJob: (jobId: string, userId: string) => void;
  cancelApplication: (jobId: string, userId: string) => void;
  updateApplicationStatus: (jobId: string, userId: string, status: JobApplication['status']) => void;
  getUserApplications: (userId: string) => JobApplication[];
  getJobApplications: (jobId: string) => JobApplication[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(sampleData.jobs.map(job => ({
    ...job,
    status: 'active' as const,
    datePosted: '2024-01-15',
    postedBy: 'provider_1'
  })));
  
  const [applications, setApplications] = useState<JobApplication[]>([
    { jobId: 'job_1', userId: 'user_1', status: 'applied', appliedDate: '2024-01-16' },
    { jobId: 'job_2', userId: 'user_1', status: 'completed', appliedDate: '2024-01-10', completedDate: '2024-01-20' },
    { jobId: 'job_3', userId: 'user_1', status: 'inProgress', appliedDate: '2024-01-12' },
  ]);

  const addJob = (job: Omit<Job, 'id'>) => {
    const newJob: Job = {
      ...job,
      id: `job_${Date.now()}`,
      applicants: 0,
      recruited: 0,
      rating: 4.5,
      status: 'active',
      datePosted: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    setApplications(prev => prev.filter(app => app.jobId !== id));
  };

  const applyForJob = (jobId: string, userId: string) => {
    const existingApp = applications.find(app => app.jobId === jobId && app.userId === userId);
    if (!existingApp) {
      const newApplication: JobApplication = {
        jobId,
        userId,
        status: 'applied',
        appliedDate: new Date().toISOString().split('T')[0]
      };
      setApplications(prev => [...prev, newApplication]);
      
      // Increment applicants count
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, applicants: job.applicants + 1 } : job
      ));
    }
  };

  const cancelApplication = (jobId: string, userId: string) => {
    setApplications(prev => prev.filter(app => !(app.jobId === jobId && app.userId === userId)));
    
    // Decrement applicants count
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, applicants: Math.max(0, job.applicants - 1) } : job
    ));
  };

  const updateApplicationStatus = (jobId: string, userId: string, status: JobApplication['status']) => {
    setApplications(prev => prev.map(app => 
      app.jobId === jobId && app.userId === userId 
        ? { ...app, status, ...(status === 'completed' ? { completedDate: new Date().toISOString().split('T')[0] } : {}) }
        : app
    ));
  };

  const getUserApplications = (userId: string) => {
    return applications.filter(app => app.userId === userId);
  };

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      applyForJob,
      cancelApplication,
      updateApplicationStatus,
      getUserApplications,
      getJobApplications
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
