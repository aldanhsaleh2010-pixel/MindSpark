import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-gray-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
        className="bg-transparent border-none text-sm text-gray-600 cursor-pointer focus:outline-none"
      >
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
