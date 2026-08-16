'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import {
  BarChart3,
  Key,
  Gamepad2,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  TrendingUp,
  Activity,
  Server,
  ChevronDown,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [allCheats, setAllCheats] = useState(0);
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<any[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);

  useEffect(() => {
    // Redirect users, sellers, and owners to their specific dashboards
    if (user?.role === 'user') {
      router.push('/dashboard/user');
      return;
    }
    if (user?.role === 'seller') {
      router.push('/dashboard/seller');
      return;
    }
    if (user?.role === 'owner') {
      router.push('/dashboard/owner');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all owners for the selector
        const ownersResponse = await getApiClient().get('/api/owners');
        if (ownersResponse.data.status === 'success') {
          setOwners(ownersResponse.data.data);
          // Set first owner as default if none selected
          if (ownersResponse.data.data.length > 0) {
            setSelectedOwnerId(ownersResponse.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch owners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, user]);

  useEffect(() => {
    // Fetch stats and cheats when owner changes
    if (!selectedOwnerId) return;

    const fetchOwnerData = async () => {
      try {
        const statsResponse = await getApiClient().get(`/api/admin/stats?ownerId=${selectedOwnerId}`);
        if (statsResponse.data.status === 'success') {
          setStats(statsResponse.data.data);
        }

        const cheatsResponse = await getApiClient().get(`/api/admin/cheats?ownerId=${selectedOwnerId}`);
        if (cheatsResponse.data.status === 'success') {
          setAllCheats(cheatsResponse.data.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch owner data:', error);
      }
    };

    fetchOwnerData();
  }, [selectedOwnerId]);

  const totalKeys = stats?.total || 0;
  const activatedKeys = stats?.activated || 0;
  const bannedKeys = stats?.banned || 0;
  const utilizationRate = totalKeys > 0 ? Math.round((activatedKeys / totalKeys) * 100) : 0;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {user?.username}! 👋</h1>
              <p className="text-blue-100 text-lg">
                Monitor system performance and manage all owners, keys, and products
              </p>
            </div>
            <Shield className="w-32 h-32 opacity-20 hidden lg:block" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Zap className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Key Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Keys */}
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stat-card-label">TOTAL KEYS</p>
                    <p className="stat-card-value text-4xl">{totalKeys}</p>
                  </div>
                  <div className="bg-blue-900/40 p-3 rounded-lg">
                    <Key className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Activated Keys */}
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stat-card-label">ACTIVATED</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{activatedKeys}</p>
                  </div>
                  <div className="bg-green-900/40 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Active Products */}
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stat-card-label">PRODUCTS</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{allCheats}</p>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded-lg">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Banned Keys */}
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stat-card-label">BANNED</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{bannedKeys}</p>
                  </div>
                  <div className="bg-red-900/40 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Key Utilization */}
              <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Key Utilization</h2>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="font-semibold text-slate-200">
                        Activation Rate
                      </span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        {utilizationRate}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 h-full rounded-full transition-all duration-700 shadow-lg shadow-blue-500/50"
                        style={{ width: `${utilizationRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
                    <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-700/50">
                      <p className="text-3xl font-bold text-green-400">
                        {activatedKeys}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Active Keys
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <p className="text-3xl font-bold text-slate-300">
                        {totalKeys - activatedKeys - bannedKeys}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Available
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-700/50">
                      <p className="text-3xl font-bold text-red-400">
                        {bannedKeys}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Banned
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">System Status</h2>
                  <Server className="w-5 h-5 text-green-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-700/50 hover:border-green-600/50 transition">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-200">Database</p>
                      <p className="text-xs text-green-400">Connected</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-700/50 hover:border-green-600/50 transition">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-200">API Server</p>
                      <p className="text-xs text-green-400">Online</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-700/50 hover:border-green-600/50 transition">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-200">File Storage</p>
                      <p className="text-xs text-green-400">Available</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700 mt-4">
                    <p className="text-xs text-slate-500">
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="/keys"
                  className="group p-6 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 border border-blue-700/50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="bg-blue-900/50 p-3 rounded-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                    <Key className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="font-semibold text-slate-200 text-sm">
                    Manage Keys
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate & monitor
                  </p>
                </a>

                <a
                  href="/cheats"
                  className="group p-6 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-700/50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="bg-purple-900/50 p-3 rounded-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="font-semibold text-slate-200 text-sm">
                    Manage Cheats
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Create & update
                  </p>
                </a>

                <a
                  href="/logs"
                  className="group p-6 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all hover:shadow-lg hover:shadow-slate-500/20"
                >
                  <div className="bg-slate-700 p-3 rounded-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="font-semibold text-slate-200 text-sm">
                    View Logs
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Track activity
                  </p>
                </a>

                <a
                  href="/bans"
                  className="group p-6 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-700/50 transition-all hover:shadow-lg hover:shadow-red-500/20"
                >
                  <div className="bg-red-900/50 p-3 rounded-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="font-semibold text-slate-200 text-sm">
                    Manage Bans
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Block HWIDs
                  </p>
                </a>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-lg p-5">
              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-200 mb-1">
                    Welcome to Your Admin Dashboard
                  </h3>
                  <p className="text-sm text-slate-400">
                    Use the navigation menu to access different sections. All actions are logged automatically for security and audit purposes.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
