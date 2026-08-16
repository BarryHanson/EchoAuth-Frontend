'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient, getAllLoaders, createLoader, updateLoaderVersion, updateLoader } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Plus, CheckCircle, Loader, Upload, Zap, Edit2 } from 'lucide-react';

export default function LoadersPage() {
  const { user } = useAuthStore();
  const [loaders, setLoaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    file: '',
    requireFilenameMatch: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [owners, setOwners] = useState<any[]>([]);
  const [editingLoader, setEditingLoader] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    version: '',
    file: '',
    requireFilenameMatch: false,
  });

  const fetchLoaders = async () => {
    try {
      const response = await getAllLoaders();
      if (response.status === 'success') {
        setLoaders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch loaders:', error);
      setError('Failed to fetch loaders');
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
    fetchLoaders();
  }, []);

  const handleCreateLoader = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await createLoader(formData.name, formData.version, formData.file, formData.requireFilenameMatch);

      if (response.status === 'success') {
        setSuccess('✓ Loader created successfully');
        setFormData({ name: '', version: '', file: '', requireFilenameMatch: false });
        setShowForm(false);
        fetchLoaders();
      } else {
        setError(response.message || 'Failed to create loader');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVersion = async (loaderId: number) => {
    try {
      const newVersion = prompt('Enter new version:');
      if (!newVersion) return;

      const response = await updateLoaderVersion(loaderId, newVersion);

      if (response.status === 'success') {
        setSuccess('✓ Version updated');
        fetchLoaders();
      }
    } catch (error) {
      setError('Failed to update version');
    }
  };

  const handleEditLoader = (loader: any) => {
    setEditingLoader(loader);
    setEditFormData({
      name: loader.name,
      version: loader.version,
      file: loader.file,
      requireFilenameMatch: loader.requireFilenameMatch,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await updateLoader(editingLoader.id, editFormData);

      if (response.status === 'success') {
        setSuccess('✓ Loader updated successfully');
        setEditingLoader(null);
        fetchLoaders();
      } else {
        setError(response.message || 'Failed to update loader');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={["god", "owner"]}>
      <div className="space-y-6">
        <AdminPageHeader
          title="Loader Management"
          description="Create and manage application loaders and versions"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<Zap className="w-6 h-6 text-purple-600" />}
          action={
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Loader
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
          <div className="card border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10">
            <h2 className="text-lg font-semibold mb-4">Create New Loader</h2>
            <form onSubmit={handleCreateLoader} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., MainLoader"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    required
                    placeholder="e.g., 1.0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Filename</label>
                  <input
                    type="text"
                    value={formData.file}
                    onChange={(e) => setFormData({ ...formData, file: e.target.value })}
                    required
                    placeholder="e.g., launcher.exe"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <input
                  type="checkbox"
                  id="requireFilename"
                  checked={formData.requireFilenameMatch}
                  onChange={(e) => setFormData({ ...formData, requireFilenameMatch: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300"
                />
                <label htmlFor="requireFilename" className="flex-1 cursor-pointer">
                  <div className="font-medium text-slate-700 dark:text-slate-300">Enforce Filename Match</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Users must run the loader with the exact filename specified above</div>
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading loaders...</p>
          </div>
        ) : loaders.length === 0 ? (
          <div className="card text-center py-16">
            <Upload className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">No loaders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loaders.map((loader) => (
              <div key={loader.id} className="card border-l-4 border-l-purple-600 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{loader.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ID: {loader.id}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                    v{loader.version}
                  </span>
                </div>

                <div className="space-y-2 mb-4 py-3 border-y border-slate-200 dark:border-slate-700">
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Filename:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400 font-mono">
                      {loader.file}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Created:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      {new Date(loader.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Filename Enforcement:
                    </span>
                    <span className={`ml-2 font-semibold ${loader.requireFilenameMatch ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                      {loader.requireFilenameMatch ? '✓ Enforced' : '○ Optional'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditLoader(loader)}
                    className="btn-secondary text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleUpdateVersion(loader.id)}
                    className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingLoader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">Edit Loader</h2>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Version</label>
                  <input
                    type="text"
                    value={editFormData.version}
                    onChange={(e) => setEditFormData({ ...editFormData, version: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Filename</label>
                  <input
                    type="text"
                    value={editFormData.file}
                    onChange={(e) => setEditFormData({ ...editFormData, file: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <input
                    type="checkbox"
                    id="editRequireFilename"
                    checked={editFormData.requireFilenameMatch}
                    onChange={(e) => setEditFormData({ ...editFormData, requireFilenameMatch: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                  <label htmlFor="editRequireFilename" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-700 dark:text-slate-300">Enforce Filename Match</div>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLoader(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
