'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Ban, CheckCircle, Loader, Key, Copy, Clock, Trash2, RotateCcw } from 'lucide-react';

interface SellerKey {
  id: number;
  key: string;
  status: string;
  hwid: string | null;
  lastip: string | null;
  subscribe: string;
  subscribeend: string | null;
  registeredUser: string | null;
  createdAt: string;
  expiresAt: string | null;
  ownerId: number;
}

interface SellerInfo {
  id: number;
  maxKeysLimit: number;
  keysGenerated: number;
  canGenerateKeys: boolean;
  canResetHWID: boolean;
}

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [keys, setKeys] = useState<SellerKey[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get app base URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiClient = getApiClient();

      if (!user?.ownerId) {
        setError('No program assigned');
        setLoading(false);
        return;
      }

      const [keysRes, sellerRes, programsRes] = await Promise.all([
        apiClient.get(`/api/admin/keys?ownerId=${user.ownerId}`).catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/seller/info').catch(() => ({ data: { data: null } })),
        apiClient.get('/api/owners').catch(() => ({ data: { data: [] } })),
      ]);

      if (keysRes.data.status === 'success') {
        setKeys(keysRes.data.data);
      }

      if (sellerRes.data.status === 'success' && sellerRes.data.data) {
        setSellerInfo(sellerRes.data.data);
      }

      if (programsRes.data.status === 'success' && user?.ownerId) {
        // Filter to only show the seller's assigned program
        const sellerProgram = programsRes.data.data.filter((p: any) => p.id === user.ownerId);
        setPrograms(sellerProgram);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };


  const handleBanKey = async (key: string) => {
    if (!window.confirm('Are you sure you want to ban this key?')) return;
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post('/api/admin/keys/ban', {
        key,
        reason: 'Banned by seller',
      });
      if (response.data.status === 'success') {
        setSuccess('✓ Key banned successfully');
        fetchData();
      }
    } catch (error) {
      setError('Failed to ban key');
    }
  };

  const handleDeleteKey = async (keyId: number) => {
    if (!window.confirm('Are you sure you want to delete this key? This cannot be undone.')) return;
    try {
      const apiClient = getApiClient();
      const response = await apiClient.delete('/api/admin/keys', {
        data: { keyId },
      });
      if (response.data.status === 'success') {
        setSuccess('✓ Key deleted successfully');
        fetchData();
      }
    } catch (error) {
      setError('Failed to delete key');
    }
  };

  const handleResetHwid = async (keyId: number) => {
    if (!window.confirm('Are you sure you want to reset the HWID for this key?')) return;
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post('/api/admin/keys/reset-hwid', {
        keyId,
      });
      if (response.data.status === 'success') {
        setSuccess('✓ HWID reset successfully');
        fetchData();
      }
    } catch (error) {
      setError('Failed to reset HWID');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('✓ Copied to clipboard');
    setTimeout(() => setSuccess(''), 2000);
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

  const stats = {
    totalKeys: keys.length,
    activatedKeys: keys.filter(k => k.status === 'activated').length,
    waitingKeys: keys.filter(k => k.status === 'waiting').length,
    bannedKeys: keys.filter(k => k.status === 'banned').length,
  };

  return (
    <ProtectedRoute requiredRoles={['seller']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage keys for your assigned program</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Total Keys</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{stats.totalKeys}</p>
          </div>
          <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Active Keys</p>
            <p className="text-4xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.activatedKeys}</p>
          </div>
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">Waiting</p>
            <p className="text-4xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">{stats.waitingKeys}</p>
          </div>
          <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm font-semibold">Banned</p>
            <p className="text-4xl font-bold text-red-700 dark:text-red-300 mt-2">{stats.bannedKeys}</p>
          </div>
        </div>

        {/* Seller Info Card */}
        {sellerInfo && (
          <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Keys Generated (Total)</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{sellerInfo.keysGenerated}</p>
              </div>
              {sellerInfo.maxKeysLimit > 0 && (
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Key Generation Limit</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                    {sellerInfo.maxKeysLimit - sellerInfo.keysGenerated} remaining
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    ({sellerInfo.keysGenerated} of {sellerInfo.maxKeysLimit})
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-lg flex gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Generate Keys Card */}
            <Link href="/keys">
              <div className="group p-6 rounded-lg bg-gradient-to-br from-blue-900/20 to-blue-800/20 hover:from-blue-900/40 hover:to-blue-800/40 border border-blue-700/50 transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
                <div className="bg-blue-900/50 p-3 rounded-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                  <Key className="w-6 h-6 text-blue-400" />
                </div>
                <p className="font-semibold text-slate-200 text-sm">Generate Keys</p>
                <p className="text-xs text-slate-400 mt-1">Create new license keys for distribution</p>
              </div>
            </Link>

            {/* Manage Keys Card */}
            <Link href="/keys">
              <div className="group p-6 rounded-lg bg-gradient-to-br from-purple-900/20 to-purple-800/20 hover:from-purple-900/40 hover:to-purple-800/40 border border-purple-700/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
                <div className="bg-purple-900/50 p-3 rounded-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                  <Copy className="w-6 h-6 text-purple-400" />
                </div>
                <p className="font-semibold text-slate-200 text-sm">Manage Keys</p>
                <p className="text-xs text-slate-400 mt-1">Ban, reset HWID, or delete keys</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Registration URLs */}
        {programs.length > 0 && (
          <div className="card bg-slate-50 dark:bg-slate-800/30">
            <h2 className="text-lg font-bold mb-2">👤 User Registration URLs</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Share these permanent registration links with your customers to register and use their purchased keys:
            </p>
            <div className="space-y-4">
              {programs.map((program) => (
                <div key={program.id} className="bg-white dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white mb-2">{program.programName}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 break-all">
                      {`${getBaseUrl()}/register/${program.programName.toLowerCase().replace(/\s+/g, '-')}`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${getBaseUrl()}/register/${program.programName.toLowerCase().replace(/\s+/g, '-')}`);
                        setSuccess('✓ Registration URL copied');
                        setTimeout(() => setSuccess(''), 2000);
                      }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition text-slate-600 dark:text-slate-400"
                      title="Copy registration URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              These URLs are permanent and public. Customers can register and enter their purchased keys.
            </p>
          </div>
        )}

        {/* Keys Table */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading keys...</p>
          </div>
        ) : (
          <div className="card">
            {keys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-400 text-lg">No keys generated yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                      <th className="text-left py-3 px-4 font-semibold">Key</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                      <th className="text-left py-3 px-4 font-semibold">Expires</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr
                        key={key.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-semibold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                              {key.key.substring(0, 16)}...
                            </code>
                            <button
                              onClick={() => copyToClipboard(key.key)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
                              title="Copy full key"
                            >
                              <Copy className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              key.status
                            )}`}
                          >
                            {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs">{Math.round(parseInt(key.subscribe) / 86400)} days</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs">{key.registeredUser || '-'}</td>
                        <td className="py-4 px-4 text-xs">
                          {key.createdAt ? new Date(key.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <div className="inline-flex gap-1 flex-wrap justify-end">
                            {key.status !== 'banned' && (
                              <button
                                onClick={() => handleBanKey(key.key)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition inline-flex items-center gap-1 text-xs"
                                title="Ban this key"
                              >
                                <Ban className="w-3 h-3" />
                                Ban
                              </button>
                            )}
                            {key.hwid && (
                              <button
                                onClick={() => handleResetHwid(key.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded transition inline-flex items-center gap-1 text-xs"
                                title="Reset HWID binding"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteKey(key.id)}
                              className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded transition inline-flex items-center gap-1 text-xs"
                              title="Delete this key"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Keys: <strong>{keys.length}</strong> | Active: <strong>{keys.filter(k => k.status === 'activated').length}</strong> | Waiting: <strong>{keys.filter(k => k.status === 'waiting').length}</strong> | Banned: <strong>{keys.filter(k => k.status === 'banned').length}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-2">📋 Seller Information</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-3 text-sm">
            As a seller, you can generate keys within your assigned limit and manage them directly. All keys you generate are tracked and associated with your account.
          </p>
          {sellerInfo?.maxKeysLimit && sellerInfo.maxKeysLimit > 0 && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              💡 You have generated {sellerInfo.keysGenerated} out of {sellerInfo.maxKeysLimit} keys
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
