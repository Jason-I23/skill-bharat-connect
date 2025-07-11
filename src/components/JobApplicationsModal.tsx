
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { JobProgressBar } from './ui/job-progress-bar';
import { useLanguage } from '../contexts/LanguageContext';
import sampleData from '../data/sampleData.json';

interface JobApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'applied' | 'completed' | 'inProgress';
}

export const JobApplicationsModal: React.FC<JobApplicationsModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  const { t } = useLanguage();

  const getFilteredApplications = () => {
    return sampleData.jobApplicationProgress.filter(app => {
      if (type === 'applied') return app.currentStage < 4;
      if (type === 'inProgress') return app.currentStage >= 4 && app.currentStage < 6;
      if (type === 'completed') return app.currentStage >= 6;
      return false;
    });
  };

  const applications = getFilteredApplications();

  const getTitle = () => {
    switch (type) {
      case 'applied': return t('jobs_applied');
      case 'completed': return t('jobs_completed');
      case 'inProgress': return t('jobs_in_progress');
      default: return t('my_applications');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applications found for this category.
            </div>
          ) : (
            applications.map((app) => (
              <Card key={app.jobId} className="border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                      <p className="text-gray-600">{app.company}</p>
                    </div>
                    <Badge variant={
                      app.currentStage >= 6 ? 'default' :
                      app.currentStage >= 4 ? 'secondary' : 'outline'
                    }>
                      {app.stages[app.currentStage]?.name || 'Applied'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <JobProgressBar
                    stages={app.stages}
                    currentStage={app.currentStage}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
