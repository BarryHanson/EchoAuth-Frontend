'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';
import { LinkIcon, Users, Key, FolderOpen, User, Loader, TrendingUp, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

interface OwnerStats {
  totalKeys: number;
  activeUsers: number;
  bannedKeys?: number;
  waitingKeys?: number;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getApiClient().get('/api/admin/stats');
        if (response.data.status === 'success') {
          setStats({
            totalKeys: response.data.data.total || 0,
            activeUsers: response.data.data.activated || 0,
            bannedKeys: response.data.data.banned || 0,
            waitingKeys: (response.data.data.total || 0) - (response.data.data.activated || 0) - (response.data.data.banned || 0),
          });
        }

        // Fetch users
        const usersResponse = await getApiClient().get('/api/admin/users');
        if (usersResponse.data.status === 'success') {
          setUsers(usersResponse.data.data);
          if (usersResponse.data.data.length > 0) {
            setSelectedUserId(usersResponse.data.data[0].id);
            setSelectedUserInfo(usersResponse.data.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
    const user = users.find(u => u.id === userId);
    setSelectedUserInfo(user);
  };

  const utilizationRate = stats && stats.totalKeys > 0 ? Math.round((stats.activeUsers / stats.totalKeys) * 100) : 0;

  const navigationCards = [
    {
      href: '/keys',
      label: 'Manage Keys',
      description: 'Generate, view, and manage license keys',
      icon: Key,
      color: 'blue',
    },
    {
      href: '/dashboard/owner/registration-links',
      label: 'Registration Links',
      description: 'Create registration URLs for users and sellers',
      icon: LinkIcon,
      color: 'green',
    },
    {
      href: '/dashboard/owner/users',
      label: 'Program Users',
      description: 'View all registered users and subscriptions',
      icon: Users,
      color: 'purple',
    },
    {
      href: '/dashboard/owner/sellers',
      label: 'Manage Sellers',
      description: 'Manage seller quotas, ban, or delete',
      icon: User,
      color: 'amber',
    },
    {
      href: '/owners',
      label: 'My Programs',
      description: 'View and manage all your programs',
      icon: FolderOpen,
      color: 'red',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-900/20 to-blue-800/20 border-blue-700/50 hover:from-blue-900/40 hover:to-blue-800/40 hover:shadow-blue-500/20',
    green: 'from-green-900/20 to-green-800/20 border-green-700/50 hover:from-green-900/40 hover:to-green-800/40 hover:shadow-green-500/20',
    purple: 'from-purple-900/20 to-purple-800/20 border-purple-700/50 hover:from-purple-900/40 hover:to-purple-800/40 hover:shadow-purple-500/20',
    amber: 'from-amber-900/20 to-amber-800/20 border-amber-700/50 hover:from-amber-900/40 hover:to-amber-800/40 hover:shadow-amber-500/20',
    red: 'from-red-900/20 to-red-800/20 border-red-700/50 hover:from-red-900/40 hover:to-red-800/40 hover:shadow-red-500/20',
  };

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <ProtectedRoute requiredRoles={['owner', 'god']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your programs, keys, users, and sellers</p>
        </div>

        {/* User Selector */}
        {users.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">View User Stats:</label>
              <div className="relative">
                <select
                  value={selectedUserId || ''}
                  onChange={(e) => handleUserChange(parseInt(e.target.value))}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg appearance-none cursor-pointer font-medium border border-gray-300 dark:border-gray-600"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} {user.expiresAt ? `(Expires: ${new Date(user.expiresAt).toLocaleDateString()})` : '(No subscription)'}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-700 dark:text-gray-300" />
              </div>
              {selectedUserInfo && (
                <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Status:</span> {selectedUserInfo.expiresAt ? 'Active' : 'Inactive'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Keys */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Keys</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{stats.totalKeys}</p>
                  </div>
                  <div className="bg-blue-900/40 p-3 rounded-lg">
                    <Key className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Users</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">{stats.activeUsers}</p>
                  </div>
                  <div className="bg-green-900/40 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Waiting Keys */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waiting Keys</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 mt-2">{stats.waitingKeys}</p>
                  </div>
                  <div className="bg-amber-900/40 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Banned Keys */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Banned Keys</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mt-2">{stats.bannedKeys}</p>
                  </div>
                  <div className="bg-red-900/40 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Activation Rate */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Key Activation Rate</h2>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="font-semibold text-slate-200">Activation Rate</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 h-full rounded-full transition-all duration-700 shadow-lg shadow-blue-500/50"
                      style={{ width: `${utilizationRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-700/50">
                    <p className="text-3xl font-bold text-green-400">{stats.activeUsers}</p>
                    <p className="text-xs text-slate-400 mt-2">Active Keys</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-3xl font-bold text-slate-300">{stats.waitingKeys}</p>
                    <p className="text-xs text-slate-400 mt-2">Waiting</p>
                  </div>
                  <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-700/50">
                    <p className="text-3xl font-bold text-red-400">{stats.bannedKeys}</p>
                    <p className="text-xs text-slate-400 mt-2">Banned</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Navigation Cards */}
        <div>
          <h2 className="text-lg font-bold mb-4">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              const colorClass = colorClasses[card.color as keyof typeof colorClasses];
              const iconColor = iconColors[card.color as keyof typeof iconColors];

              return (
                <Link key={card.href} href={card.href}>
                  <div className={`card bg-gradient-to-br ${colorClass} border transition-all hover:shadow-lg cursor-pointer h-full`}>
                    <div className={`inline-block p-3 rounded-lg bg-slate-900/20 mb-3`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{card.label}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
