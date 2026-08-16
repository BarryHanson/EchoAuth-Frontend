'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Loader, Trash2, CheckCircle, Plus, RotateCcw, Lock, Unlock, Edit2, Users } from 'lucide-react';

interface Seller {
  id: number;
  userId: number;
  ownerId: number;
  maxKeysLimit: number;
  keysGenerated: number;
  canGenerateKeys: boolean;
  canResetHWID: boolean;
  isActive: boolean;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

export default function SellersManagementPage() {
  const { user } = useAuthStore();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingSellerId, setEditingSellerId] = useState<number | null>(null);
  const [editQuota, setEditQuota] = useState<string>('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [owners, setOwners] = useState<any[]>([]);

  useEffect(() => {
    const initializePage = async () => {
      if (user?.role === 'god') {
        // For God users, fetch owners
        try {
          const response = await getApiClient().get('/api/owners');
          if (response.data.status === 'success') {
            setOwners(response.data.data);
            if (response.data.data.length > 0) {
              setSelectedOwnerId(response.data.data[0].id);
            }
          }
        } catch (error) {
          console.error('Failed to fetch owners:', error);
        }
      } else {
        // For Owner users, use their ownerId
        if (user?.ownerId) {
          setSelectedOwnerId(user.ownerId);
        }
      }
    };
    initializePage();
  }, [user?.role, user?.ownerId]);

  useEffect(() => {
    if (selectedOwnerId) {
      fetchSellers();
    }
  }, [selectedOwnerId]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApiClient().get(`/api/admin/program/${selectedOwnerId}/sellers`);
      if (response.data.status === 'success') {
        setSellers(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuota = async (sellerId: number, seller: Seller) => {
    try {
      const response = await getApiClient().post('/api/admin/seller/quota', {
        sellerId,
        maxKeysLimit: parseInt(editQuota),
      });

      if (response.data.status === 'success') {
        setSuccess(`✓ Updated ${seller.user.username}'s quota to ${editQuota} keys`);
        setEditingSellerId(null);
        fetchSellers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quota');
    }
  };

  const handleToggleActive = async (sellerId: number, currentStatus: boolean, username: string) => {
    const action = currentStatus ? 'ban' : 'unban';
    if (!window.confirm(`${action.toUpperCase()} seller "${username}"?`)) return;

    try {
      const response = await getApiClient().post('/api/admin/seller/toggle-active', {
        sellerId,
        isActive: !currentStatus,
      });

      if (response.data.status === 'success') {
        setSuccess(`✓ Seller "${username}" ${action}ned`);
        fetchSellers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update seller status');
    }
  };

  const handleResetKeyCount = async (sellerId: number, username: string) => {
    if (!window.confirm(`Reset key count for "${username}"? This will set their generated keys to 0.`)) return;

    try {
      const response = await getApiClient().post('/api/admin/seller/reset-keys', {
        sellerId,
      });

      if (response.data.status === 'success') {
        setSuccess(`✓ Reset key count for "${username}"`);
        fetchSellers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset key count');
    }
  };

  const handleDeleteSeller = async (sellerId: number, username: string) => {
    if (!window.confirm(`DELETE seller "${username}"?\n\nThis will remove them from the system but their generated keys will remain.`)) return;

    try {
      const response = await getApiClient().delete('/api/admin/seller', {
        data: { sellerId },
      });

      if (response.data.status === 'success') {
        setSuccess(`✓ Deleted seller "${username}"`);
        fetchSellers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete seller');
    }
  };

  return (
    <ProtectedRoute requiredRoles={['owner', 'god']}>
      <div className="space-y-6">
        <AdminPageHeader
          title="Manage Sellers"
          description="View and manage your sellers/resellers"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<Users className="w-6 h-6" />}
          action={
            <Link href="/dashboard/owner/registration-links">
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Generate Seller Link
              </button>
            </Link>
          }
        />

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

        {/* Sellers List */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading sellers...</p>
          </div>
        ) : (
          <div className="card">
            {sellers.length === 0 ? (
              <div className="text-center py-16">
                <Edit2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">No sellers yet</p>
                <Link href="/dashboard/owner/registration-links">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors inline-block">
                    Create First Seller Link
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                      <th className="text-left py-3 px-4 font-semibold">Username</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Keys Generated</th>
                      <th className="text-left py-3 px-4 font-semibold">Max Limit</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((seller) => (
                      <tr
                        key={seller.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                      >
                        <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                          {seller.user.username}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              seller.isActive
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {seller.isActive ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                          {seller.keysGenerated}
                          {seller.maxKeysLimit > 0 && <span className="text-slate-500"> / {seller.maxKeysLimit}</span>}
                        </td>
                        <td className="py-4 px-4">
                          {editingSellerId === seller.id ? (
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={editQuota}
                                onChange={(e) => setEditQuota(e.target.value)}
                                className="w-20"
                                min="0"
                              />
                              <button
                                onClick={() => handleUpdateQuota(seller.id, seller)}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSellerId(null)}
                                className="px-2 py-1 bg-slate-600 hover:bg-slate-700 text-white text-xs rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono">
                                {seller.maxKeysLimit === 0 ? '∞ (Unlimited)' : seller.maxKeysLimit}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingSellerId(seller.id);
                                  setEditQuota(seller.maxKeysLimit.toString());
                                }}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="Edit quota"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-1 flex-wrap justify-end">
                            <button
                              onClick={() => handleToggleActive(seller.id, seller.isActive, seller.user.username)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                                seller.isActive
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                              }`}
                              title={seller.isActive ? 'Ban seller' : 'Unban seller'}
                            >
                              {seller.isActive ? (
                                <>
                                  <Lock className="w-3 h-3" />
                                  Ban
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3" />
                                  Unban
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleResetKeyCount(seller.id, seller.user.username)}
                              className="flex items-center gap-1 px-2 py-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded text-xs transition"
                              title="Reset key count to 0"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Reset
                            </button>
                            <button
                              onClick={() => handleDeleteSeller(seller.id, seller.user.username)}
                              className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs transition"
                              title="Delete seller"
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
            {sellers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Total Sellers: <strong>{sellers.length}</strong> | Active: <strong>{sellers.filter(s => s.isActive).length}</strong> | Banned: <strong>{sellers.filter(s => !s.isActive).length}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Banner */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-2">📋 Seller Management</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>✓ <strong>Edit Quota</strong> - Adjust their max key generation limit</li>
            <li>✓ <strong>Ban/Unban</strong> - Temporarily disable or re-enable seller access</li>
            <li>✓ <strong>Reset Keys</strong> - Reset their generated key counter to 0</li>
            <li>✓ <strong>Delete</strong> - Permanently remove seller (their keys remain)</li>
            <li>✓ <strong>Seller Link</strong> - Generate registration links in Registration Links page</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
