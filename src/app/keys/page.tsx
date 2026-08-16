'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Plus, Ban, CheckCircle, Loader, Key, Copy, Clock, Zap, Trash2, RotateCcw } from 'lucide-react';

export default function KeysPage() {
  const { user } = useAuthStore();
  const [keys, setKeys] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '1',
    programId: '',
    duration: '30',
    timeUnit: 'days',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (programId?: string) => {
    try {
      setLoading(true);
      const apiClient = getApiClient();
      const pidToUse = programId || selectedProgramId;

      // Fetch keys and programs in parallel
      const [keysRes, programsRes] = await Promise.all([
        pidToUse
          ? apiClient.get(`/api/admin/keys?ownerId=${pidToUse}`).catch(() => ({ data: { data: [] } }))
          : apiClient.get('/api/admin/keys').catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/owners').catch(() => ({ data: { data: [] } })),
      ]);

      if (keysRes.data.status === 'success') {
        setKeys(keysRes.data.data);
      }

      if (programsRes.data.status === 'success') {
        let availablePrograms = programsRes.data.data;

        // For God users, only show selected owner's programs
        if (user?.role === 'god' && selectedOwnerId) {
          availablePrograms = availablePrograms.filter((p: any) => p.id === selectedOwnerId);
        }
        // For sellers, only show their assigned program
        else if (user?.role === 'seller' && user?.ownerId) {
          availablePrograms = availablePrograms.filter((p: any) => p.id === user.ownerId);
        }

        setPrograms(availablePrograms);
        // Auto-select first program if not already selected
        if (availablePrograms.length > 0 && !pidToUse) {
          const firstProgramId = availablePrograms[0].id.toString();
          setSelectedProgramId(firstProgramId);
          setFormData((prev) => ({ ...prev, programId: firstProgramId }));
        }
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

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
      } else if (user?.ownerId) {
        // For Owner users, use their ownerId
        setSelectedOwnerId(user.ownerId);
      }
    };
    initializePage();
  }, [user?.role, user?.ownerId]);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch keys when selected program or owner changes
  useEffect(() => {
    if (selectedProgramId) {
      fetchData(selectedProgramId);
      setFormData((prev) => ({ ...prev, programId: selectedProgramId }));
    }
  }, [selectedProgramId]);

  // Filter programs when owner changes for God users
  useEffect(() => {
    if (selectedOwnerId && user?.role === 'god') {
      setSelectedProgramId('');
      fetchData();
    }
  }, [selectedOwnerId]);

  const calculateDays = (duration: string, timeUnit: string): number => {
    const num = parseInt(duration);
    switch (timeUnit) {
      case 'hours':
        return num / 24;
      case 'days':
        return num;
      case 'weeks':
        return num * 7;
      case 'months':
        return num * 30;
      case 'lifetime':
        return 365 * 100; // 100 years
      default:
        return num;
    }
  };

  const handleGenerateKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!formData.programId) {
      setError('Please select a program');
      setSubmitting(false);
      return;
    }

    try {
      const apiClient = getApiClient();
      const quantity = parseInt(formData.quantity);
      const days = calculateDays(formData.duration, formData.timeUnit);

      const generatedKeys = [];
      for (let i = 0; i < quantity; i++) {
        // Generate random key
        const randomKey = `KEY-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const response = await apiClient.post('/api/admin/keys/generate', {
          key: randomKey,
          ownerId: parseInt(formData.programId),
          days: Math.ceil(days),
        });

        if (response.data.status === 'success') {
          generatedKeys.push(randomKey);
        }
      }

      if (generatedKeys.length > 0) {
        setSuccess(
          `✓ Generated ${generatedKeys.length} key${generatedKeys.length > 1 ? 's' : ''} successfully`
        );
        setFormData({ quantity: '1', programId: formData.programId, duration: '30', timeUnit: 'days' });
        setShowForm(false);
        await fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBanKey = async (key: string) => {
    if (!window.confirm('Are you sure you want to ban this key?')) return;
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post('/api/admin/keys/ban', {
        key,
        reason: 'Banned from admin panel',
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

  const getDurationLabel = (duration: string, timeUnit: string) => {
    if (timeUnit === 'lifetime') return 'Lifetime';
    return `${duration} ${timeUnit}`;
  };

  return (
    <ProtectedRoute requiredRoles={['god', 'owner', 'seller']}>
      <div className="space-y-6">
        <AdminPageHeader
          title="License Keys"
          description="Generate and manage license keys"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<Key className="w-6 h-6" />}
          action={
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Keys
            </button>
          }
        />

        {/* Program Selector */}
        {programs.length > 0 && (
          <div className="card bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center gap-4">
              <label className="font-medium text-sm">Select Program:</label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {programs.map((program) => (
                  <option key={program.id} value={program.id.toString()}>
                    {program.programName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Alerts */}
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

        {/* Generate Form */}
        {showForm && (
          <div className="card border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
            <h2 className="text-lg font-semibold mb-6">Generate New License Keys</h2>
            <form onSubmit={handleGenerateKeys} className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="How many keys to generate"
                  required
                  min="1"
                  max="100"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">Generate 1-100 keys at once</p>
              </div>

              {/* Program Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Program</label>
                <select
                  value={formData.programId}
                  onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                  required
                  className="w-full"
                >
                  <option value="">-- Select a program --</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id.toString()}>
                      {program.programName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <select
                    value={formData.timeUnit}
                    onChange={(e) => setFormData({ ...formData, timeUnit: e.target.value })}
                    className="w-full"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
                {formData.timeUnit !== 'lifetime' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Length</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      min="1"
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Generating...' : 'Generate'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
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
                <p className="text-slate-600 dark:text-slate-400 text-lg">No keys found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                      <th className="text-left py-3 px-4 font-semibold">Key</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Program</th>
                      <th className="text-left py-3 px-4 font-semibold">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold">HWID</th>
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                      <th className="text-left py-3 px-4 font-semibold">Expires</th>
                      <th className="text-left py-3 px-4 font-semibold">Created By</th>
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
                            <span className="text-xs">
                              {programs.find((p) => p.id === key.ownerId)?.programName || `Program ${key.ownerId}`}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs">{Math.round(parseInt(key.subscribe) / 86400)} days</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {key.hwid ? key.hwid.substring(0, 12) + '...' : '-'}
                          </code>
                        </td>
                        <td className="py-4 px-4 text-xs">{key.registeredUser || '-'}</td>
                        <td className="py-4 px-4 text-xs">
                          {key.createdAt ? new Date(key.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                          {key.creator || '-'}
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
      </div>
    </ProtectedRoute>
  );
}
