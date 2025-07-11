
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation and Auth
    welcome: 'Welcome to Skill India Jobs',
    heroDescription: 'Connecting skilled workers with opportunities across India through government-backed employment solutions.',
    login: 'Login',
    register: 'Register',
    jobSeekerRegistration: 'Job Seeker Registration',
    
    // Stats and Features
    jobSeekers: 'Job Seekers',
    jobsPosted: 'Jobs Posted',
    successRate: 'Success Rate',
    certifications: 'Certifications',
    forJobSeekers: 'For Job Seekers',
    forEmployers: 'For Employers',
    jobSeekerDescription: 'Find skilled jobs that match your expertise',
    employerDescription: 'Connect with verified skilled professionals',
    jobSeekerFeature1: 'Browse verified job opportunities',
    jobSeekerFeature2: 'Get matched with relevant positions',
    jobSeekerFeature3: 'Track your application progress',
    jobSeekerFeature4: 'Access skill development programs',
    employerFeature1: 'Post job requirements quickly',
    employerFeature2: 'Access pre-verified candidates',
    employerFeature3: 'Manage applications efficiently',
    employerFeature4: 'Government compliance support',
    
    // Credibility
    whyTrustUs: 'Why Trust Skill India Jobs?',
    credibilityDescription: 'Our platform is backed by government initiatives and focuses on verified opportunities.',
    governmentBacked: 'Government Backed',
    governmentBackedDesc: 'Official government initiative for employment',
    verifiedJobs: 'Verified Jobs',
    verifiedJobsDesc: 'All opportunities are pre-verified for authenticity',
    skillDevelopment: 'Skill Development',
    skillDevelopmentDesc: 'Continuous learning and certification programs',
    
    // Job related
    jobs_applied: 'Jobs Applied',
    jobs_completed: 'Jobs Completed',
    jobs_in_progress: 'Jobs In Progress',
    my_applications: 'My Applications',
    recommended_jobs: 'Recommended Jobs',
    job_filters: 'Job Filters',
    location: 'Location',
    skills: 'Skills',
    verified_job: 'Verified Job',
    high_paying: 'High Paying',
    skill_match: 'Skill Match',
    applied: 'Applied',
    apply_now: 'Apply Now',
    job_description: 'Job Description',
    have_resume: 'Do you have a resume?',
    upload_resume: 'Upload Resume',
    
    // Footer
    skillIndiaJobs: 'Skill India Jobs',
    footerDescription: 'Empowering skilled workers across India with verified job opportunities.',
    governmentLinks: 'Government Links',
    skillIndiaPortal: 'Skill India Portal',
    indiaGov: 'India.gov.in',
    nationalCareerService: 'National Career Service',
    quickLinks: 'Quick Links',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    support: 'Support',
    helpCenter: 'Help Center',
    faq: 'FAQ',
    technicalSupport: 'Technical Support',
    allRightsReserved: 'All rights reserved.'
  },
  ta: {
    // Navigation and Auth
    welcome: 'திறமை இந்தியா வேலைகளுக்கு வரவேற்கிறோம்',
    heroDescription: 'அரசாங்க ஆதரவு வேலைவாய்ப்பு தீர்வுகள் மூலம் திறமையான தொழிலாளர்களை இந்தியா முழுவதும் வாய்ப்புகளுடன் இணைக்கிறோம்.',
    login: 'உள்நுழைவு',
    register: 'பதிவு',
    jobSeekerRegistration: 'வேலை தேடுபவர் பதிவு',
    
    // Stats and Features
    jobSeekers: 'வேலை தேடுபவர்கள்',
    jobsPosted: 'வேலைகள் இடுகை',
    successRate: 'வெற்றி விகிதம்',
    certifications: 'சான்றிதழ்கள்',
    forJobSeekers: 'வேலை தேடுபவர்களுக்கு',
    forEmployers: 'முதலாளிகளுக்கு',
    jobSeekerDescription: 'உங்கள் திறமைக்கு பொருந்தும் திறமையான வேலைகளைக் கண்டறியுங்கள்',
    employerDescription: 'சரிபார்க்கப்பட்ட திறமையான நிபுணர்களுடன் இணைக்கவும்',
    jobSeekerFeature1: 'சரிபார்க்கப்பட்ட வேலை வாய்ப்புகளை உலாவுங்கள்',
    jobSeekerFeature2: 'தொடர்புடைய பதவிகளுடன் பொருத்தம் பெறுங்கள்',
    jobSeekerFeature3: 'உங்கள் விண்ணப்ப முன்னேற்றத்தைக் கண்காணிக்கவும்',
    jobSeekerFeature4: 'திறன் மேம்பாட்டு திட்டங்களை அணுகவும்',
    employerFeature1: 'வேலை தேவைகளை விரைவாக இடுகையிடுங்கள்',
    employerFeature2: 'முன்-சரிபார்க்கப்பட்ட வேட்பாளர்களை அணுகவும்',
    employerFeature3: 'விண்ணப்பங்களை திறமையாக நிர்வகிக்கவும்',
    employerFeature4: 'அரசாங்க இணக்க ஆதரவு',
    
    // Credibility
    whyTrustUs: 'திறமை இந்தியா வேலைகளை ஏன் நம்புவது?',
    credibilityDescription: 'எங்கள் தளம் அரசாங்க முன்முயற்சிகளால் ஆதரிக்கப்படுகிறது மற்றும் சரிபார்க்கப்பட்ட வாய்ப்புகளில் கவனம் செலுத்துகிறது.',
    governmentBacked: 'அரசாங்க ஆதரவு',
    governmentBackedDesc: 'வேலைவாய்ப்புக்கான உத்தியோகபூர்வ அரசு முன்முயற்சி',
    verifiedJobs: 'சரிபார்க்கப்பட்ட வேலைகள்',
    verifiedJobsDesc: 'அனைத்து வாய்ப்புகளும் நம்பகத்தன்மைக்காக முன்-சரிபார்க்கப்படுகின்றன',
    skillDevelopment: 'திறன் மேம்பாடு',
    skillDevelopmentDesc: 'தொடர்ச்சியான கற்றல் மற்றும் சான்றிதழ் திட்டங்கள்',
    
    // Job related
    jobs_applied: 'விண்ணப்பித்த வேலைகள்',
    jobs_completed: 'முடிக்கப்பட்ட வேலைகள்',
    jobs_in_progress: 'முன்னேற்றத்தில் உள்ள வேலைகள்',
    my_applications: 'எனது விண்ணப்பங்கள்',
    recommended_jobs: 'பரிந்துரைக்கப்பட்ட வேலைகள்',
    job_filters: 'வேலை வடிகட்டிகள்',
    location: 'இடம்',
    skills: 'திறன்கள்',
    verified_job: 'சரிபார்க்கப்பட்ட வேலை',
    high_paying: 'அதிக ஊதியம்',
    skill_match: 'திறன் பொருத்தம்',
    applied: 'விண்ணப்பித்தார்',
    apply_now: 'இப்போது விண்ணப்பிக்கவும்',
    job_description: 'வேலை விவரம்',
    have_resume: 'உங்களிடம் ரெசியூம் உள்ளதா?',
    upload_resume: 'ரெசியூம் பதிவேற்றம்',
    
    // Footer
    skillIndiaJobs: 'திறமை இந்தியா வேலைகள்',
    footerDescription: 'சரிபார்க்கப்பட்ட வேலை வாய்ப்புகளுடன் இந்தியா முழுவதும் திறமையான தொழிலாளர்களை மேம்படுத்துதல்.',
    governmentLinks: 'அரசாங்க இணைப்புகள்',
    skillIndiaPortal: 'திறமை இந்தியா போர்டல்',
    indiaGov: 'India.gov.in',
    nationalCareerService: 'தேசிய தொழில் சேவை',
    quickLinks: 'விரைவு இணைப்புகள்',
    aboutUs: 'எங்களைப் பற்றி',
    contactUs: 'எங்களை தொடர்பு கொள்ளவும்',
    privacyPolicy: 'தனியுரிமை கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்',
    support: 'ஆதரவு',
    helpCenter: 'உதவி மையம்',
    faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    technicalSupport: 'தொழில்நுட்ப ஆதரவு',
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
