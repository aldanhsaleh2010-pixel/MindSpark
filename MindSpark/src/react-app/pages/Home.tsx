import { useAuth } from '@getmocha/users-service/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Zap, Brain, Clock, Trophy, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-3 rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            MindSpark
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your downtime between classes into moments of growth. Get personalized micro-activities that keep your mind engaged and earn rewards along the way.
          </p>
          <button
            onClick={redirectToLogin}
            className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
          >
            Get Started with Google
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl w-fit mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Activities</h3>
            <p className="text-gray-600 text-sm">
              Puzzles, brain teasers, and short stories tailored to your interests and available time.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl w-fit mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Perfect Timing</h3>
            <p className="text-gray-600 text-sm">
              Activities delivered based on your class schedule, making every break productive.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl w-fit mb-4">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
            <p className="text-gray-600 text-sm">
              Collect points and unlock badges as you complete activities and build learning streaks.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl w-fit mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Stay Focused</h3>
            <p className="text-gray-600 text-sm">
              Keep your mind sharp and refreshed, making your study sessions more effective.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-sky-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="font-semibold text-gray-900">Set Your Schedule</h3>
              <p className="text-gray-600">
                Add your class times so we know when you have breaks between lessons.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-sky-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="font-semibold text-gray-900">Choose Interests</h3>
              <p className="text-gray-600">
                Select the types of activities you enjoy most for a personalized experience.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-sky-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="font-semibold text-gray-900">Spark Your Mind</h3>
              <p className="text-gray-600">
                Get engaging activities delivered at the perfect time to keep you sharp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-2 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-400">
            © 2024 MindSpark. Keep your mind engaged, one activity at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
