import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import NavBar from '@/react-app/components/NavBar';
import { Settings as SettingsIcon, Bell, User, LogOut, Save } from 'lucide-react';

interface UserProfile {
  id: number;
  user_id: string;
  name: string | null;
  timezone: string;
  notifications_enabled: boolean;
  points: number;
  level: number;
}

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    timezone: 'UTC',
    notifications_enabled: true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || user?.google_user_data.name || '',
          timezone: data.timezone || 'UTC',
          notifications_enabled: data.notifications_enabled ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 rounded-2xl w-fit mx-auto mb-6">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-xl text-gray-600">Manage your account and preferences</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <SettingsIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Settings */}
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-600" />
                    Profile Settings
                  </h2>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your display name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        Notification Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications_enabled}
                            onChange={(e) => setFormData({ ...formData, notifications_enabled: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="font-medium text-gray-900">Activity Notifications</span>
                            <p className="text-sm text-gray-600">Get notified when it's time for an activity</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                        saving
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Account Info & Actions */}
              <div className="space-y-6">
                {/* Account Info */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {user.google_user_data.picture && (
                        <img 
                          src={user.google_user_data.picture} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full border-2 border-gray-200"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {profile?.name || user.google_user_data.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Level</span>
                        <span className="font-semibold text-blue-600">{profile?.level || 1}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Points</span>
                        <span className="font-semibold text-green-600">{profile?.points || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/schedule')}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SettingsIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Manage Schedule</span>
                    </button>
                    <button
                      onClick={() => navigate('/interests')}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">Update Interests</span>
                    </button>
                  </div>
                </div>

                {/* Logout */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
