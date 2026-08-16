'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient, getAllBans, banHwid, unbanHwid } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Plus, Trash2, AlertCircle, CheckCircle, Loader, Shield } from 'lucide-react';

export default function BansPage() {
  const { user } = useAuthStore();
  const [bans, setBans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ hwid: '', reason: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [owners, setOwners] = useState<any[]>([]);

  const fetchBans = async () => {
    try {
      const response = await getAllBans();
      if (response.status === 'success') {
        setBans(response.data);
      }
    } catch (error) {
      setError('Failed to fetch bans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      if (user?.role === 'god') {
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
      } else if (user?.ownerId) {
        setSelectedOwnerId(user.ownerId);
      }
    };
    initializePage();
  }, [user?.role, user?.ownerId]);

  useEffect(() => {
    fetchBans();
  }, []);

  const handleBanHwid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await banHwid(formData.hwid, formData.reason);
      if (response.status === 'success') {
        setSuccess('✓ HWID banned successfully');
        setFormData({ hwid: '', reason: '' });
        setShowForm(false);
        fetchBans();
      } else {
        setError(response.message || 'Failed to ban HWID');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnbanHwid = async (hwid: string) => {
    if (!window.confirm('Are you sure you want to unban this HWID?')) return;
    try {
      const response = await unbanHwid(hwid);
      if (response.status === 'success') {
        setSuccess('✓ HWID unbanned successfully');
        fetchBans();
      }
    } catch (error) {
      setError('Failed to unban HWID');
    }
  };

  return (
    <ProtectedRoute requiredRoles={["god", "owner", "seller"]}>
      <div className="space-y-6">
        <AdminPageHeader
          title="HWID Blacklist Management"
          description="Ban and manage hardware IDs to prevent unauthorized access"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<Shield className="w-6 h-6 text-red-600" />}
          action={
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ban HWID
            </button>
          }
        />

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

        {showForm && (
          <div className="card border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <h2 className="text-lg font-semibold mb-4">Ban Hardware ID</h2>
            <form onSubmit={handleBanHwid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hardware ID (HWID)</label>
                <input
                  type="text"
                  value={formData.hwid}
                  onChange={(e) => setFormData({ ...formData, hwid: e.target.value })}
                  required
                  placeholder="Enter hardware ID to ban"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Ban</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  placeholder="Explain why this HWID is being banned..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="btn-danger">
                  {submitting ? 'Banning...' : 'Ban HWID'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading bans...</p>
          </div>
        ) : (
          <div className="card">
            {bans.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  No HWIDs currently banned
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                  {bans.length} hardware ID{bans.length !== 1 ? 's' : ''} currently banned
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold">HWID</th>
                        <th className="text-left py-3 px-4 font-semibold">Ban Reason</th>
                        <th className="text-left py-3 px-4 font-semibold">Banned Date</th>
                        <th className="text-right py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bans.map((ban) => (
                        <tr key={ban.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                          <td className="py-4 px-4">
                            <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                              {ban.hwid}
                            </code>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {ban.reason}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {new Date(ban.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleUnbanHwid(ban.hwid)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 p-2 rounded transition flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Unban
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
