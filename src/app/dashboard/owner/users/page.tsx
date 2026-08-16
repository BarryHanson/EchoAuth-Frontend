'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Loader, Users, Trash2, ChevronDown } from 'lucide-react';

interface OwnerUser {
  id: number;
  user: {
    id: number;
    username: string;
  };
  key: string;
  status: string;
  activatedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

interface Program {
  id: number;
  slug: string;
  name: string;
}

export default function OwnerUsersPage() {
  const { user } = useAuthStore();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [users, setUsers] = useState<OwnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, [user?.id]);

  useEffect(() => {
    if (selectedProgramId) {
      fetchUsers();
    }
  }, [selectedProgramId]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApiClient().get('/api/owners');
      if (response.data.status === 'success') {
        const ownerPrograms = response.data.data.map((owner: any) => ({
          id: owner.id,
          slug: owner.programSlug || 'unknown',
          name: owner.programName || 'Unknown Program',
        }));
        setPrograms(ownerPrograms);
        if (ownerPrograms.length > 0) {
          setSelectedProgramId(ownerPrograms[0].id);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedProgramId) {
        setError('No program selected');
        setLoading(false);
        return;
      }

      const response = await getApiClient().get(`/api/registration/users/${selectedProgramId}`);
      if (response.data.status === 'success') {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load users');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeUser = async (userKeyId: number, username: string) => {
    if (!window.confirm(`Revoke ${username}'s subscription?`)) return;

    try {
      const response = await getApiClient().post('/api/registration/revoke-user', {
        userKeyId,
      });

      if (response.data.status === 'success') {
        setSuccess(`✅ ${username}'s subscription revoked`);
        setTimeout(() => setSuccess(null), 3000);
        fetchUsers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke subscription');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activated':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'banned':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      case 'waiting':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <ProtectedRoute requiredRoles={['owner', 'god']}>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Program Users</h1>
            <p className="text-gray-400">View and manage users who have registered with your keys</p>
          </div>

          {/* Program Selector */}
          {programs.length > 0 && (
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-semibold text-slate-300">Select Program:</label>
              <div className="relative">
                <select
                  value={selectedProgramId || ''}
                  onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                  className="appearance-none bg-slate-800 border border-slate-700 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">-- Choose a program --</option>
                  {programs.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Messages */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              ❌ {error}
            </div>
          )}

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-16">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-400">Loading users...</p>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
              {users.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400">No users have registered yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-900/50">
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">Username</th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">Activated</th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">Expires</th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">Days Remaining</th>
                        <th className="px-6 py-4 text-right text-gray-400 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => {
                        const expiresDate = userItem.expiresAt ? new Date(userItem.expiresAt) : null;
                        const now = new Date();
                        const daysRemaining = expiresDate
                          ? Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                          : null;

                        return (
                          <tr
                            key={userItem.id}
                            className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold text-white">{userItem.user.username}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  userItem.status
                                )}`}
                              >
                                {userItem.status.charAt(0).toUpperCase() + userItem.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-xs">
                              {userItem.activatedAt ? new Date(userItem.activatedAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-xs">
                              {expiresDate ? expiresDate.toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-xs">
                              {daysRemaining !== null ? `${Math.max(0, daysRemaining)} days` : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleRevokeUser(userItem.id, userItem.user.username)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition inline-flex items-center gap-1 text-xs"
                                title="Revoke subscription"
                              >
                                <Trash2 className="w-3 h-3" />
                                Revoke
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/30">
                    <p className="text-xs text-slate-500">
                      Total Users: <strong>{users.length}</strong> | Active: <strong>{users.filter(u => u.isActive).length}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
