import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.activity': 'Activity',
    'nav.schedule': 'Schedule',
    'nav.interests': 'Interests',
    'nav.stats': 'Stats',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.ready': 'Ready to spark your mind with a quick activity?',
    'dashboard.quickActivity': 'Quick Activity',
    'dashboard.perfectBreak': 'Perfect for your next break',
    'dashboard.engage': 'Take 2 minutes to engage your mind with a personalized activity. Build your streak and earn points!',
    'dashboard.startActivity': 'Start Activity',
    'dashboard.totalPoints': 'Total Points',
    'dashboard.activitiesDone': 'Activities Done',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.manageSchedule': 'Manage Schedule',
    'dashboard.updateInterests': 'Update Interests',
    'dashboard.viewStats': 'View Stats',
    'dashboard.todayProgress': "Today's Progress",
    'dashboard.readyNext': 'Ready for your next activity!',
    
    // Activity
    'activity.getDifferent': 'Get different activity',
    'activity.description': 'Description',
    'activity.activity': 'Activity',
    'activity.enjoyment': 'How much did you enjoy this? (Optional)',
    'activity.submitAnswer': 'Submit Answer',
    'activity.markComplete': 'Mark as Complete',
    'activity.completed': 'Activity Completed! 🎉',
    'activity.earned': 'You earned',
    'activity.points': 'points',
    'activity.tryAnother': 'Try Another Activity',
    'activity.backDashboard': 'Back to Dashboard',
    'activity.noActivities': 'No Activities Available',
    'activity.noMatch': 'It looks like there are no activities that match your interests yet.',
    'activity.yourAnswer': 'Your Answer',
    'activity.enterAnswer': 'Enter your answer here...',
    'activity.correct': 'Correct! 🎉',
    'activity.incorrect': 'Not quite right. Try again!',
    'activity.correctAnswer': 'The correct answer is',
    
    // Common
    'common.loading': 'Loading...',
    'common.difficulty': 'Difficulty',
    'common.level': 'Level',
    'common.badges': 'Badges',
    'common.min': 'min',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    
    // Activity Types
    'activityType.puzzle': 'Puzzle',
    'activityType.story': 'Story', 
    'activityType.math': 'Math',
    'activityType.brain_teaser': 'Brain Teaser',
    'activityType.trivia': 'Trivia',
    'activityType.quote': 'Quote',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'الرئيسية',
    'nav.activity': 'النشاط',
    'nav.schedule': 'الجدول',
    'nav.interests': 'الاهتمامات',
    'nav.stats': 'الإحصائيات',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك مرة أخرى',
    'dashboard.ready': 'هل أنت مستعد لتحفيز عقلك بنشاط سريع؟',
    'dashboard.quickActivity': 'نشاط سريع',
    'dashboard.perfectBreak': 'مثالي لاستراحتك القادمة',
    'dashboard.engage': 'خذ دقيقتين لتحفيز عقلك بنشاط مخصص لك. ابني سلسلتك واكسب النقاط!',
    'dashboard.startActivity': 'ابدأ النشاط',
    'dashboard.totalPoints': 'إجمالي النقاط',
    'dashboard.activitiesDone': 'الأنشطة المكتملة',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.manageSchedule': 'إدارة الجدول',
    'dashboard.updateInterests': 'تحديث الاهتمامات',
    'dashboard.viewStats': 'عرض الإحصائيات',
    'dashboard.todayProgress': 'تقدم اليوم',
    'dashboard.readyNext': 'مستعد لنشاطك التالي!',
    
    // Activity
    'activity.getDifferent': 'احصل على نشاط مختلف',
    'activity.description': 'الوصف',
    'activity.activity': 'النشاط',
    'activity.enjoyment': 'كم استمتعت بهذا؟ (اختياري)',
    'activity.submitAnswer': 'إرسال الإجابة',
    'activity.markComplete': 'تحديد كمكتمل',
    'activity.completed': 'تم إكمال النشاط! 🎉',
    'activity.earned': 'لقد كسبت',
    'activity.points': 'نقطة',
    'activity.tryAnother': 'جرب نشاطاً آخر',
    'activity.backDashboard': 'العودة للرئيسية',
    'activity.noActivities': 'لا توجد أنشطة متاحة',
    'activity.noMatch': 'يبدو أنه لا توجد أنشطة تتطابق مع اهتماماتك حتى الآن.',
    'activity.yourAnswer': 'إجابتك',
    'activity.enterAnswer': 'أدخل إجابتك هنا...',
    'activity.correct': 'صحيح! 🎉',
    'activity.incorrect': 'ليس صحيحاً تماماً. حاول مرة أخرى!',
    'activity.correctAnswer': 'الإجابة الصحيحة هي',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.difficulty': 'الصعوبة',
    'common.level': 'المستوى',
    'common.badges': 'الشارات',
    'common.min': 'دقيقة',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    
    // Activity Types
    'activityType.puzzle': 'لغز',
    'activityType.story': 'قصة',
    'activityType.math': 'رياضيات',
    'activityType.brain_teaser': 'محفز ذهني',
    'activityType.trivia': 'ثقافة عامة',
    'activityType.quote': 'اقتباس',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ar'); // Default to Arabic
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  // Set initial direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
