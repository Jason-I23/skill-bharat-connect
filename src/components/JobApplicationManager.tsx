
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { MapPin, Calendar, IndianRupee, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useJobs } from '../contexts/JobContext';

interface JobApplicationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  applicationType: 'applied' | 'inProgress' | 'completed';
  userId: string;
}

const JobApplicationManager: React.FC<JobApplicationManagerProps> = ({
  isOpen,
  onClose,
  applicationType,
  userId
}) => {
  const { t } = useLanguage();
  const { jobs, applications, cancelApplication, getUserApplications } = useJobs();

  const userApplications = getUserApplications(userId).filter(app => app.status === applicationType);
  
  const getJobDetails = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  const handleCancelApplication = (jobId: string) => {
    cancelApplication(jobId, userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'inProgress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTitle = () => {
    switch (applicationType) {
      case 'applied': return t('jobs_applied');
      case 'inProgress': return t('jobs_in_progress');
      case 'completed': return t('jobs_completed');
      default: return t('my_jobs');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {t('manage_job_applications')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {userApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('no_applications_found')}</p>
            </div>
          ) : (
            userApplications.map((application) => {
              const job = getJobDetails(application.jobId);
              if (!job) return null;

              return (
                <Card key={application.jobId} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ₹{job.payment.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">{t(job.paymentType)}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {t('applied')}: {application.appliedDate}
                      </Badge>
                      <Badge className={getStatusColor(application.status)}>
                        {t(application.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{job.description}</p>

                    {application.status === 'completed' && application.completedDate && (
                      <div className="bg-green-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-800">
                            {t('payment_received')}: ₹{job.payment.toLocaleString()} ({application.completedDate})
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {application.status === 'applied' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelApplication(job.id)}
                        >
                          {t('cancel_application')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationManager;
