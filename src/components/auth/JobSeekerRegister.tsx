
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import sampleData from '../../data/sampleData.json';

const JobSeekerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showResumeDialog, setShowResumeDialog] = useState(true);
  const [hasResume, setHasResume] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    pincode: '',
    education: '',
    keySkills: '',
    employmentStatus: ''
  });

  const handleResumeChoice = () => {
    if (!hasResume) {
      toast.error('Please select an option');
      return;
    }
    
    if (hasResume === 'no') {
      setShowResumeDialog(false);
      return;
    }
    
    // If yes, show file upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setResumeFile(file);
        // Simulate parsing resume and pre-filling form
        const resumeData = sampleData.resumeParsingResult;
        setFormData({
          firstName: resumeData.firstName,
          middleName: resumeData.middleName,
          lastName: resumeData.lastName,
          email: resumeData.email,
          phone: resumeData.phone,
          state: resumeData.state,
          pincode: resumeData.pincode,
          education: resumeData.education,
          keySkills: resumeData.keySkills,
          employmentStatus: resumeData.employmentStatus
        });
        setShowResumeDialog(false);
        toast.success('Resume uploaded successfully! Form fields have been pre-filled.');
      }
    };
    fileInput.click();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const userData = {
      id: 'seeker1',
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      userType: 'jobSeeker' as const,
      profileData: formData
    };
    
    login(userData);
    
    // Show NCS portal notification
    toast.success('Profile created successfully! Your data has been updated in the NCS portal as well.', {
      duration: 5000,
    });
    
    navigate('/dashboard/jobSeeker');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Job Seeker Registration</CardTitle>
          <CardDescription>Create your profile to start applying for jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {!showResumeDialog ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {resumeFile && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">Resume uploaded: {resumeFile.name}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Form fields have been pre-filled from your resume</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleData.states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Education & Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold">Education & Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education Level</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleData.educationLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="keySkills">Key Skills</Label>
                    <Input
                      id="keySkills"
                      value={formData.keySkills}
                      onChange={(e) => handleInputChange('keySkills', e.target.value)}
                      placeholder="e.g., Plumbing, Electrical Work, Carpentry"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Create Profile
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/auth-choice?action=register')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>

      {/* Resume Upload Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume Upload</DialogTitle>
            <DialogDescription>
              Do you have a resume to upload? We can pre-fill your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={hasResume} onValueChange={setHasResume}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="resume-yes" />
                <Label htmlFor="resume-yes" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Yes, I have a resume to upload
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="resume-no" />
                <Label htmlFor="resume-no">No, I'll fill the form manually</Label>
              </div>
            </RadioGroup>
            <Button onClick={handleResumeChoice} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSeekerRegister;
