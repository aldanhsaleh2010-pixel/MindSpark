import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import NavBar from '@/react-app/components/NavBar';
import { Activity as ActivityIcon, Clock, Star, Trophy, RefreshCw, CheckCircle, Send } from 'lucide-react';
import { Activity as ActivityType } from '@/shared/types';

interface ExtendedActivity extends ActivityType {
  answer?: string;
  answer_type?: string;
}

export default function Activity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activity, setActivity] = useState<ExtendedActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [submissionResult, setSubmissionResult] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchRandomActivity();
  }, [user, navigate]);

  const fetchRandomActivity = async () => {
    setLoading(true);
    setCompleted(false);
    setRating(0);
    setUserAnswer('');
    setSubmissionResult(null);
    setStartTime(Date.now());
    
    try {
      const response = await fetch('/api/activities/random');
      if (response.ok) {
        const data = await response.json();
        setActivity(data);
      } else {
        console.error('No activities available');
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activity || !userAnswer.trim()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/activities/${activity.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: userAnswer.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmissionResult({
          isCorrect: result.is_correct,
          message: result.is_correct ? t('activity.correct') : t('activity.incorrect')
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!activity || !startTime) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await fetch(`/api/activities/${activity.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time_spent: timeSpent,
          rating: rating || undefined,
        }),
      });

      if (response.ok) {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  const getActivityTypeLabel = (type: string) => {
    return t(`activityType.${type}`) || type;
  };

  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const hasAnswer = activity?.answer && activity.answer.trim();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <ActivityIcon className="w-8 h-8 text-blue-600" />
              </div>
              <span className="ml-3 text-gray-600">{t('common.loading')}</span>
            </div>
          ) : activity ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <ActivityIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{activity.title}</h1>
                      <p className="text-blue-100">{getActivityTypeLabel(activity.activity_type)}</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchRandomActivity}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                    title={t('activity.getDifferent')}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{Math.floor(activity.estimated_duration / 60)} {t('common.min')}
                  </div>
                  <div className="flex items-center gap-1">
                    {t('common.difficulty')}: {getDifficultyStars(activity.difficulty_level)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {activity.points_reward} {t('activity.points')}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('activity.description')}</h2>
                  <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('activity.activity')}</h2>
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{activity.content}</p>
                  </div>
                </div>

                {/* Answer Submission */}
                {hasAnswer && !completed && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('activity.yourAnswer')}</h3>
                    <div className="space-y-4">
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={t('activity.enterAnswer')}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!userAnswer.trim() || submitting}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                      >
                        {submitting ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                        {t('activity.submitAnswer')}
                      </button>

                      {/* Submission Result */}
                      {submissionResult && (
                        <div className={`p-4 rounded-xl ${
                          submissionResult.isCorrect 
                            ? 'bg-green-100 border border-green-200 text-green-800' 
                            : 'bg-red-100 border border-red-200 text-red-800'
                        }`}>
                          <p className="font-semibold">{submissionResult.message}</p>
                          {!submissionResult.isCorrect && activity.answer && (
                            <p className="mt-2 text-sm">
                              {t('activity.correctAnswer')}: <span className="font-medium">{activity.answer}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!completed ? (
                  <div className="space-y-6">
                    {/* Rating */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">{t('activity.enjoyment')}</h3>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-colors"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Complete Button */}
                    <button
                      onClick={handleComplete}
                      className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {t('activity.markComplete')}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-2">{t('activity.completed')}</h3>
                      <p className="text-green-700">{t('activity.earned')} {activity.points_reward} {t('activity.points')}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={fetchRandomActivity}
                        className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        {t('activity.tryAnother')}
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                      >
                        {t('activity.backDashboard')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('activity.noActivities')}</h3>
              <p className="text-gray-600 mb-6">
                {t('activity.noMatch')}
              </p>
              <button
                onClick={() => navigate('/interests')}
                className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                {t('dashboard.updateInterests')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
