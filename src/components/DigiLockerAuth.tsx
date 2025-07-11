
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Shield, Check, FileText, User, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

interface DigiLockerAuthProps {
  isAuthenticated?: boolean;
  onAuthenticate?: (isAuthenticated: boolean) => void;
}

const DigiLockerAuth: React.FC<DigiLockerAuthProps> = ({ 
  isAuthenticated = false, 
  onAuthenticate 
}) => {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const documents = [
    { id: 'aadhaar', name: t('aadhaar_card'), icon: CreditCard, verified: false },
    { id: 'pan', name: t('pan_card'), icon: FileText, verified: false },
    { id: 'driving_license', name: t('driving_license'), icon: FileText, verified: false },
    { id: 'voter_id', name: t('voter_id'), icon: User, verified: false }
  ];

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    
    // Simulate DigiLocker authentication process
    setTimeout(() => {
      setIsAuthenticating(false);
      onAuthenticate?.(true);
      setShowDialog(false);
      toast.success(t('digilocker_auth_success'));
    }, 3000);
  };

  const toggleDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Shield className="w-4 h-4 mr-1" />
          {t('verified_profile')}
        </Badge>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
      >
        <Shield className="w-4 h-4" />
        {t('authenticate_digilocker')}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('digilocker_authentication')}
            </DialogTitle>
            <DialogDescription>
              {t('digilocker_auth_description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t('select_documents')}</h4>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDocuments.includes(doc.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleDocument(doc.id)}
                  >
                    <doc.icon className="w-4 h-4" />
                    <span className="flex-1">{doc.name}</span>
                    {selectedDocuments.includes(doc.id) && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                {t('digilocker_redirect_info')}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleAuthenticate}
                disabled={selectedDocuments.length === 0 || isAuthenticating}
                className="flex-1"
              >
                {isAuthenticating ? t('authenticating') : t('proceed_digilocker')}
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DigiLockerAuth;
