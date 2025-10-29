import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import NavBar from '@/react-app/components/NavBar';
import { Heart, Check, Puzzle, BookOpen, Calculator, Brain, HelpCircle, Quote } from 'lucide-react';
import { INTEREST_TYPES, InterestType } from '@/shared/types';

const interestConfig = {
  puzzle: { icon: Puzzle, label: 'Puzzles', description: 'Logic puzzles and pattern recognition' },
  story: { icon: BookOpen, label: 'Stories', description: 'Creative writing and micro-fiction' },
  math: { icon: Calculator, label: 'Math', description: 'Mental math and problem solving' },
  brain_teaser: { icon: Brain, label: 'Brain Teasers', description: 'Mind-bending challenges' },
  trivia: { icon: HelpCircle, label: 'Trivia', description: 'Fun facts and knowledge tests' },
  quote: { icon: Quote, label: 'Quotes', description: 'Inspirational quotes and reflections' },
};

export default function Interests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchInterests();
  }, [user, navigate]);

  const fetchInterests = async () => {
    try {
      const response = await fetch('/api/interests');
      if (response.ok) {
        const data = await response.json();
        const interests = data.map((item: any) => item.interest_type);
        setSelectedInterests(interests);
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: InterestType) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (response.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving interests:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-2xl w-fit mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Interests</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the types of activities you enjoy most. We'll personalize your experience based on your preferences.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          ) : (
            <>
              {/* Interest Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {INTEREST_TYPES.map((interest) => {
                  const config = interestConfig[interest];
                  const isSelected = selectedInterests.includes(interest);
                  const IconComponent = config.icon;
                  
                  return (
                    <div
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-100 to-sky-100 border-2 border-blue-300 shadow-lg'
                          : 'bg-white/70 backdrop-blur-sm border border-white/50 hover:shadow-xl'
                      } rounded-3xl p-8 shadow-lg`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-sky-500 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-600 to-sky-500' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200'
                      } p-4 rounded-2xl w-fit mx-auto mb-4 transition-all duration-300`}>
                        <IconComponent className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      
                      <h3 className={`text-xl font-bold text-center mb-2 ${
                        isSelected ? 'text-blue-800' : 'text-gray-900'
                      }`}>
                        {config.label}
                      </h3>
                      
                      <p className={`text-center text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {config.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || selectedInterests.length === 0}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                    saving || selectedInterests.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {saving ? 'Saving...' : `Save ${selectedInterests.length} Interest${selectedInterests.length !== 1 ? 's' : ''}`}
                </button>
              </div>

              {selectedInterests.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                  Select at least one interest to get personalized activities
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
