'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { getApiClient } from '@/lib/api';
import { AlertCircle, CheckCircle, Loader, User, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await getApiClient().post('/api/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.status === 'success') {
        setSuccess('Password changed successfully');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <User className="w-8 h-8" />
          Account Profile
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded flex gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user?.username}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Admin Account
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Username
                </label>
                <p className="text-lg font-semibold">{user?.username}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Role
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${
                    user?.role === 'admin' ? 'badge-success' : 'badge-primary'
                  }`}>
                    <Shield className="w-3 h-3 inline mr-1" />
                    {user?.role}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  User ID
                </label>
                <p className="text-lg font-mono font-semibold">{user?.id || 'N/A'}</p>
              </div>

              {user?.ownerId && (
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Owner ID
                  </label>
                  <p className="text-lg font-mono font-semibold">{user.ownerId}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Account Status
                </label>
                <span className="badge badge-success mt-1">Active</span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-6">Security</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Security Tip:</strong> Change your password regularly to keep your
                  account secure.
                </p>
              </div>

              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-primary w-full"
                >
                  Change Password
                </button>
              )}

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center gap-2"
                    >
                      {loading && <Loader className="w-4 h-4 animate-spin" />}
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          oldPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="card mt-6">
          <h2 className="text-lg font-semibold mb-4">Account Activity</h2>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              <strong>Last Login:</strong> {new Date().toLocaleString()}
            </p>
            <p>
              <strong>Account Created:</strong> System Account
            </p>
            <p>
              <strong>Login IP:</strong> {typeof window !== 'undefined' ? 'Your IP' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
