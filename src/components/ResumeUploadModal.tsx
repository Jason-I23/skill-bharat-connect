
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Upload, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import sampleData from '../data/sampleData.json';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResumeData: (data: any) => void;
  onSkipResume: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onResumeData,
  onSkipResume
}) => {
  const { t } = useLanguage();
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    // Simulate resume parsing - in real app this would use OCR/AI
    setTimeout(() => {
      onResumeData(sampleData.resumeTemplate);
      onClose();
    }, 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSkip = () => {
    onSkipResume();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('have_resume')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <CardContent className="p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">{t('upload_resume')}</p>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your resume or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </label>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button onClick={handleSkip} variant="outline" className="flex-1">
              Skip & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
