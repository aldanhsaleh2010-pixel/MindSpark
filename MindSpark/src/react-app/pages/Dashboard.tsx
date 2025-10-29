import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import NavBar from '@/react-app/components/NavBar';
import { Play, Trophy, Calendar, Zap, ArrowRight, Clock } from 'lucide-react';

interface UserStats {
  total_completions: number;
  total_points: number;
  current_level: number;
  total_badges: number;
}

interface UserProfile {
  id: number;
  user_id: string;
  name: string | null;
  points: number;
  level: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsResponse, profileResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/profile')
        ]);

        if (statsResponse.ok && profileResponse.ok) {
          const statsData = await statsResponse.json();
          const profileData = await profileResponse.json();
          setStats(statsData);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleStartActivity = () => {
    navigate('/activity');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}, {user.google_user_data.given_name || 'there'}! 👋
          </h1>
          <p className="text-gray-600">{t('dashboard.ready')}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Action Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Play className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{t('dashboard.quickActivity')}</h2>
                      <p className="text-blue-100">{t('dashboard.perfectBreak')}</p>
                    </div>
                  </div>
                  <p className="text-lg mb-6 text-blue-50">
                    {t('dashboard.engage')}
                  </p>
                  <button
                    onClick={handleStartActivity}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    {t('dashboard.startActivity')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Zap className="w-32 h-32" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('dashboard.totalPoints')}</h3>
                      <p className="text-2xl font-bold text-green-600">{stats?.total_points || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('dashboard.activitiesDone')}</h3>
                      <p className="text-2xl font-bold text-purple-600">{stats?.total_completions || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  {user.google_user_data.picture && (
                    <img 
                      src={user.google_user_data.picture} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {profile?.name || user.google_user_data.name || user.email}
                    </h3>
                    <p className="text-sm text-gray-600">{t('common.level')} {stats?.current_level || 1}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('activity.points')}</span>
                    <span className="font-semibold text-blue-600">{stats?.total_points || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('common.badges')}</span>
                    <span className="font-semibold text-purple-600">{stats?.total_badges || 0}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/schedule')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">{t('dashboard.manageSchedule')}</span>
                  </button>
                  <button
                    onClick={() => navigate('/interests')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">{t('dashboard.updateInterests')}</span>
                  </button>
                  <button
                    onClick={() => navigate('/stats')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trophy className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">{t('dashboard.viewStats')}</span>
                  </button>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.todayProgress')}</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-4 rounded-xl mb-2">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600">{t('dashboard.readyNext')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
