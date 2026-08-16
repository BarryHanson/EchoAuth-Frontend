'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { getApiClient } from '@/lib/api';
import { AlertCircle, Plus, Trash2, Edit2, Users, Loader, Building2, CheckCircle } from 'lucide-react';

interface Owner {
  id: number;
  username: string;
  programName: string;
  programSlug: string;
  description: string;
  sellerCount: number;
  keyCount: number;
  createdAt: string;
}

interface Seller {
  id: number;
  username: string;
  maxKeysLimit: number;
  keysGenerated: number;
  canResetHWID: boolean;
  canGenerateKeys: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function OwnersPage() {
  const { user, token } = useAuthStore();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    programName: '',
    programSlug: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isGod = user?.role === 'god';
  const isOwner = user?.role === 'owner';

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setOwners(data.data);
      }
    } catch (err) {
      setError('Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async (ownerId: number) => {
    try {
      setSellers([]); // Clear previous sellers immediately
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owners/${ownerId}/sellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSellers(data.data);
      }
    } catch (err) {
      setError('Failed to fetch sellers');
    }
  };

  useEffect(() => {
    if (isGod) {
      fetchOwners();
    } else if (isOwner) {
      // Fetch owner's all programs (they can own multiple)
      const fetchOwnPrograms = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owners`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.status === 'success' && data.data && Array.isArray(data.data)) {
            // Filter to only programs owned by this user
            const myPrograms = data.data;
            setOwners(myPrograms);
            if (myPrograms.length > 0) {
              setSelectedOwner(myPrograms[0]);
              fetchSellers(myPrograms[0].id);
            }
          }
        } catch (err) {
          setError('Failed to fetch your programs');
        } finally {
          setLoading(false);
        }
      };
      fetchOwnPrograms();
    }
  }, [isGod, isOwner, token]);

  const handleSelectOwner = (owner: Owner) => {
    setSelectedOwner(owner);
    fetchSellers(owner.id);
  };

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // God needs username, password, programName, and programSlug
    if (isGod && (!formData.username || !formData.password || !formData.programName || !formData.programSlug)) {
      setError('All fields are required');
      return;
    }

    // Owner only needs programName and programSlug
    if (isOwner && (!formData.programName || !formData.programSlug)) {
      setError('Program name and slug are required');
      return;
    }

    try {
      // For owners, don't send username/password
      const payload = isOwner
        ? {
            programName: formData.programName,
            programSlug: formData.programSlug,
            description: formData.description,
          }
        : formData;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owners`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setSuccess('✓ Program created successfully');
        setFormData({
          username: '',
          password: '',
          programName: '',
          programSlug: '',
          description: '',
        });
        setShowForm(false);
        fetchOwners();
      } else {
        setError(data.message || 'Failed to create program');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleDeleteOwner = async (ownerId: number, programName: string) => {
    const confirmMsg = `⚠️ DANGER: Delete "${programName}"?\n\nThis will PERMANENTLY delete:\n• All license keys\n• All user subscriptions\n• All assigned sellers\n• All related data\n\nThis action CANNOT be undone!`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await getApiClient().delete('/api/admin/program', {
        data: { ownerId },
      });

      if (response.data.status === 'success') {
        setSuccess(`✓ Program "${programName}" and all associated data deleted`);
        setSelectedOwner(null);
        fetchOwners();
      } else {
        setError(response.data.message || 'Failed to delete program');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete program');
    }
  };

  return (
    <ProtectedRoute requiredRoles={['god', 'owner']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              {isGod ? 'Programs Management' : 'My Program'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage programs and resellers
            </p>
          </div>
          {(isGod || isOwner) && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2 text-lg"
            >
              <Plus className="w-5 h-5" />
              New Program
            </button>
          )}
        </div>

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

        {/* Create Form */}
        {showForm && (isGod || isOwner) && (
          <div className="card border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
            <h2 className="text-lg font-semibold mb-4">
              {isGod ? 'Create New Program' : 'Create Additional Program'}
            </h2>
            <form onSubmit={handleCreateOwner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isGod && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Owner Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="owner_username"
                        required={isGod}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required={isGod}
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Program Name</label>
                  <input
                    type="text"
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                    placeholder="My Game"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Program Slug</label>
                  <input
                    type="text"
                    value={formData.programSlug}
                    onChange={(e) => setFormData({ ...formData, programSlug: e.target.value })}
                    placeholder="my-game"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Program description..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  Create Program
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Owners List */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading programs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Owners Column */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Programs</h3>
                {owners.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-slate-600 dark:text-slate-400">No programs yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {owners.map((owner) => (
                      <button
                        key={owner.id}
                        onClick={() => handleSelectOwner(owner)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedOwner?.id === owner.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-sm">{owner.programName}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{owner.username}</div>
                        <div className="text-xs text-slate-500 mt-2 flex gap-2">
                          <span>Sellers: {owner.sellerCount}</span>
                          <span>Keys: {owner.keyCount}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sellers Column */}
            <div className="lg:col-span-2">
              {selectedOwner ? (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Resellers for {selectedOwner.programName}
                    </h3>
                    {isGod && (
                      <button className="btn-primary text-sm flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Add Seller
                      </button>
                    )}
                  </div>

                  {sellers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-600 dark:text-slate-400">No resellers yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-semibold text-sm">Username</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Keys Generated</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Permissions</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellers.map((seller) => (
                            <tr
                              key={seller.id}
                              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                            >
                              <td className="py-4 px-4 font-semibold text-sm">{seller.username}</td>
                              <td className="py-4 px-4 text-sm">
                                {seller.keysGenerated}
                                {seller.maxKeysLimit > 0 && ` / ${seller.maxKeysLimit}`}
                              </td>
                              <td className="py-4 px-4 text-sm">
                                <div className="text-xs space-y-1">
                                  {seller.canGenerateKeys && <span className="text-green-600">✓ Generate Keys</span>}
                                  {seller.canResetHWID && <span className="text-green-600">✓ Reset HWID</span>}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    seller.isActive
                                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                  }`}
                                >
                                  {seller.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                {isGod && (
                                  <button className="text-red-600 hover:text-red-700 p-2 rounded transition">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {(isGod || isOwner) && (
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                        <h4 className="font-bold text-red-900 dark:text-red-300 mb-2">⚠️ Danger Zone</h4>
                        <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                          Deleting this program will permanently remove all keys, subscriptions, sellers, and related data.
                        </p>
                        <button
                          onClick={() => handleDeleteOwner(selectedOwner.id, selectedOwner.programName)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete This Program
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card text-center py-16">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-600 dark:text-slate-400">Select a program to view resellers</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
