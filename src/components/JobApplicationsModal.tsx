
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { JobProgressBar } from './ui/job-progress-bar';
import { Button } from './ui/button';
import { MapPin, IndianRupee, Calendar, Building } from 'lucide-react';
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {getTitle()}
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No applications found</div>
              <p>You haven't {type === 'applied' ? 'applied to any jobs' : type === 'completed' ? 'completed any jobs' : 'started any jobs'} yet.</p>
            </div>
          ) : (
            applications.map((app) => (
              <Card key={app.jobId} className="border shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{app.jobTitle}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {app.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {app.jobLocation || 'Location not specified'}
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          ₹{app.salary?.toLocaleString() || 'Salary not disclosed'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied: {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        app.currentStage >= 6 ? 'default' :
                        app.currentStage >= 4 ? 'secondary' : 'outline'
                      } className="text-sm px-3 py-1">
                        {app.stages[app.currentStage]?.name || 'Applied'}
                      </Badge>
                      {app.nextUpdateDate && (
                        <div className="text-xs text-gray-500">
                          Next update: {new Date(app.nextUpdateDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Job Description */}
                  {app.jobDescription && (
                    <div>
                      <h4 className="font-medium mb-2">Job Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{app.jobDescription}</p>
                    </div>
                  )}

                  {/* Job Requirements */}
                  {app.requirements && app.requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {app.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Progress Tracker */}
                  <div>
                    <h4 className="font-medium mb-3">Application Progress</h4>
                    <JobProgressBar
                      stages={app.stages}
                      currentStage={app.currentStage}
                      className="mb-4"
                    />
                  </div>

                  {/* Additional Information */}
                  {app.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1 text-blue-900">Latest Update</h4>
                      <p className="text-sm text-blue-800">{app.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
