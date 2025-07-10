
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  CheckCircle, 
  DollarSign, 
  UserCheck, 
  Briefcase, 
  Star, 
  Clock, 
  X,
  Eye,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'job_selected' | 'job_applied' | 'payment_received' | 'payment_completed' | 'job_application' | 'job_completed' | 'rating_received';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  data?: any;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Sample notifications based on user type
  const getNotifications = (): Notification[] => {
    if (user?.userType === 'jobSeeker') {
      return [
        {
          id: 'n1',
          type: 'job_selected',
          title: 'Job Selection',
          message: 'Congratulations! You have been selected for the Plumber position at Home Repair Services.',
          timestamp: '2024-01-10T10:30:00Z',
          read: false,
          actionable: true,
          data: { jobId: 'job_1', employerName: 'Home Repair Services' }
        },
        {
          id: 'n2',
          type: 'payment_received',
          title: 'Payment Received',
          message: 'Payment of ₹15,000 has been credited to your account for the completed plumbing job.',
          timestamp: '2024-01-08T14:15:00Z',
          read: false,
          actionable: false,
          data: { amount: 15000, jobTitle: 'Residential Plumbing Work' }
        },
        {
          id: 'n3',
          type: 'job_applied',
          title: 'Application Submitted',
          message: 'Your application for Electrical Technician position has been submitted successfully.',
          timestamp: '2024-01-05T09:20:00Z',
          read: true,
          actionable: false,
          data: { jobId: 'job_2', jobTitle: 'Electrical Technician' }
        },
        {
          id: 'n4',
          type: 'rating_received',
          title: 'New Rating',
          message: 'You received a 5-star rating from Home Repair Services for excellent plumbing work.',
          timestamp: '2024-01-03T16:45:00Z',
          read: true,
          actionable: false,
          data: { rating: 5, employer: 'Home Repair Services' }
        }
      ];
    } else {
      return [
        {
          id: 'n1',
          type: 'job_application',
          title: 'New Application',
          message: 'Rajesh Kumar has applied for your Plumber position. Rating: 4.8/5.0',
          timestamp: '2024-01-10T11:20:00Z',
          read: false,
          actionable: true,
          data: { applicantName: 'Rajesh Kumar', jobTitle: 'Plumber', rating: 4.8 }
        },
        {
          id: 'n2',
          type: 'payment_completed',
          title: 'Payment Processed',
          message: 'Payment of ₹25,000 has been successfully processed for the electrical maintenance job.',
          timestamp: '2024-01-08T15:30:00Z',
          read: false,
          actionable: false,
          data: { amount: 25000, jobTitle: 'Electrical Maintenance' }
        },
        {
          id: 'n3',
          type: 'job_completed',
          title: 'Job Completed',
          message: 'Amit Sharma has marked the carpentry job as completed. Please review and release payment.',
          timestamp: '2024-01-05T12:10:00Z',
          read: true,
          actionable: true,
          data: { workerName: 'Amit Sharma', jobTitle: 'Furniture Carpentry' }
        },
        {
          id: 'n4',
          type: 'job_application',
          title: 'New Application',
          message: 'Priya Sharma has applied for your Painting Specialist position. Rating: 4.2/5.0',
          timestamp: '2024-01-02T10:45:00Z',
          read: true,
          actionable: true,
          data: { applicantName: 'Priya Sharma', jobTitle: 'Painting Specialist', rating: 4.2 }
        }
      ];
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_selected':
      case 'job_application':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'payment_received':
      case 'payment_completed':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'job_applied':
      case 'job_completed':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'rating_received':
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm text-gray-900">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      {notification.data && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {notification.data.amount && (
                            <Badge variant="outline" className="text-xs">
                              ₹{notification.data.amount.toLocaleString()}
                            </Badge>
                          )}
                          {notification.data.rating && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {notification.data.rating}
                            </Badge>
                          )}
                          {notification.data.jobTitle && (
                            <Badge variant="outline" className="text-xs">
                              {notification.data.jobTitle}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {notification.actionable && (
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        )}
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPanel;
