
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Badge } from './badge';
import { Star, MapPin, Calendar, CheckCircle, CreditCard, Clock } from 'lucide-react';

interface JobProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  previousJobsPosted: number;
  jobsCompleted: number;
  creditWorthiness: number;
  paymentCompleteness: number;
  overallRating: number;
  location: string;
}

interface JobProviderModalProps {
  provider: JobProvider | null;
  isOpen: boolean;
  onClose: () => void;
}

const StarRating: React.FC<{ rating: number; label: string }> = ({ rating, label }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    </div>
  );
};

export const JobProviderModal: React.FC<JobProviderModalProps> = ({
  provider,
  isOpen,
  onClose
}) => {
  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {provider.name}
            {provider.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {provider.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overall Rating */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">Overall Rating</h3>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-lg">{provider.overallRating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Job Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-600">{provider.previousJobsPosted}</div>
              <div className="text-xs text-gray-600">Jobs Posted</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-600">{provider.jobsCompleted}</div>
              <div className="text-xs text-gray-600">Jobs Completed</div>
            </div>
          </div>

          {/* Rating Details */}
          <div className="space-y-1">
            <StarRating rating={provider.creditWorthiness} label="Credit Worthiness" />
            <StarRating rating={provider.paymentCompleteness} label="Payment Timeliness" />
          </div>

          {/* Contact Information */}
          <div className="border-t pt-3 space-y-2">
            <div className="text-sm">
              <span className="font-medium">Email:</span>
              <span className="ml-2 text-gray-600">{provider.email}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Phone:</span>
              <span className="ml-2 text-gray-600">{provider.phone}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
