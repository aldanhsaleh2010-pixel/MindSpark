import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import NavBar from '@/react-app/components/NavBar';
import { BarChart3, Trophy, Zap, Target, Calendar, Star } from 'lucide-react';

interface UserStats {
  total_completions: number;
  total_points: number;
  current_level: number;
  total_badges: number;
}

export default function Stats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPointsForNextLevel = (currentLevel: number) => {
    return currentLevel * 100; // Simple leveling system
  };

  const getProgressToNextLevel = (points: number, level: number) => {
    const pointsForCurrentLevel = (level - 1) * 100;
    const pointsForNextLevel = level * 100;
    const progressPoints = points - pointsForCurrentLevel;
    const requiredPoints = pointsForNextLevel - pointsForCurrentLevel;
    
    return Math.min((progressPoints / requiredPoints) * 100, 100);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-2xl w-fit mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Progress</h1>
            <p className="text-xl text-gray-600">Track your learning journey and achievements</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          ) : stats ? (
            <div className="space-y-8">
              {/* Level Progress */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Level {stats.current_level}</h2>
                    <p className="text-gray-600">Keep learning to level up!</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-4 rounded-2xl">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{stats.total_points} points</span>
                    <span>{getPointsForNextLevel(stats.current_level)} points needed for Level {stats.current_level + 1}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressToNextLevel(stats.total_points, stats.current_level)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Activities Completed</h3>
                      <p className="text-3xl font-bold text-blue-600">{stats.total_completions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Total Points</h3>
                      <p className="text-3xl font-bold text-green-600">{stats.total_points}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-3 rounded-xl">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Current Level</h3>
                      <p className="text-3xl font-bold text-purple-600">{stats.current_level}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-3 rounded-xl">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Badges Earned</h3>
                      <p className="text-3xl font-bold text-orange-600">{stats.total_badges}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Trophy className="w-7 h-7 text-yellow-500" />
                  Achievements
                </h2>

                {stats.total_completions === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journey</h3>
                    <p className="text-gray-600 mb-6">Complete your first activity to unlock achievements!</p>
                    <button
                      onClick={() => navigate('/activity')}
                      className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Start First Activity
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Potential achievements based on stats */}
                    {stats.total_completions >= 1 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-500 p-2 rounded-full">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800">First Steps</h3>
                            <p className="text-sm text-green-600">Completed your first activity</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {stats.total_completions >= 5 && (
                      <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-2xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-500 p-2 rounded-full">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-800">Getting Started</h3>
                            <p className="text-sm text-blue-600">Completed 5 activities</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {stats.total_points >= 100 && (
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-500 p-2 rounded-full">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-purple-800">Point Collector</h3>
                            <p className="text-sm text-purple-600">Earned 100+ points</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {stats.current_level >= 2 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-yellow-500 p-2 rounded-full">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-yellow-800">Level Up</h3>
                            <p className="text-sm text-yellow-600">Reached Level 2</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Motivational Call to Action */}
              {stats.total_completions > 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl shadow-xl p-8 text-white text-center">
                  <h2 className="text-2xl font-bold mb-4">Keep Up the Great Work! 🌟</h2>
                  <p className="text-lg text-blue-100 mb-6">
                    You're making amazing progress. Ready for your next challenge?
                  </p>
                  <button
                    onClick={() => navigate('/activity')}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Continue Learning
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Stats Available</h3>
              <p className="text-gray-600">Start completing activities to see your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
