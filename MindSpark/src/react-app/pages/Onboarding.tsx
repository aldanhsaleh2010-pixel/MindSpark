import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { ChevronRight, Calendar, Heart } from 'lucide-react';

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Welcome Step */}
          {step === 1 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-2xl w-fit mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to MindSpark, {user.google_user_data.given_name || 'there'}! 🎉
              </h1>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Let's get you set up with personalized micro-activities that fit perfectly into your daily schedule. This will only take a minute!
              </p>
              <button
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
              >
                Let's Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Schedule Step */}
          {step === 2 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-2xl w-fit mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Set Your Class Schedule</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Add your classes so we can send you activities at the perfect time - right when you have breaks between lessons.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/schedule')}
                  className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
                >
                  Add My Classes
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="text-gray-600 hover:text-gray-800 underline text-sm"
                >
                  Skip for now (I'll add them later)
                </button>
              </div>
            </div>
          )}

          {/* Interests Step */}
          {step === 3 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-2xl w-fit mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Interests</h2>
              <p className="text-gray-600 mb-8 text-lg">
                What types of activities would you like to receive? We'll personalize your experience based on your preferences.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/interests')}
                  className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
                >
                  Select My Interests
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleComplete}
                  className="text-gray-600 hover:text-gray-800 underline text-sm"
                >
                  Skip for now (I'll choose later)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
