'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Plus, CheckCircle, Loader, Code2, Edit2, Trash2, Upload, X, Download } from 'lucide-react';

export default function CheatsPage() {
  const { user } = useAuthStore();
  const [cheats, setCheats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    filename: '',
    process: '',
    injection: '',
    external: false,
    requireHwidLock: true,
    requireIpLock: true,
    status: 'Undetected',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cheatFiles, setCheatFiles] = useState<{ [key: number]: any }>({});
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [owners, setOwners] = useState<any[]>([]);

  const fetchCheatFileInfo = async (cheatId: number) => {
    try {
      const response = await getApiClient().get(`/api/admin/cheats/${cheatId}/file/info`);
      if (response.data.status === 'success' && response.data.data) {
        setCheatFiles((prev) => ({
          ...prev,
          [cheatId]: response.data.data,
        }));
      }
    } catch (error) {
      // File not found is ok, just means no file uploaded yet
    }
  };

  const fetchCheats = async () => {
    try {
      const response = await getApiClient().get('/api/admin/cheats');
      if (response.data.status === 'success') {
        setCheats(response.data.data);
        // Fetch file info for each cheat
        response.data.data.forEach((cheat: any) => {
          fetchCheatFileInfo(cheat.id);
        });
      }
    } catch (error) {
      setError('Failed to fetch cheats');
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
    fetchCheats();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      filename: '',
      process: '',
      injection: '',
      external: false,
      requireHwidLock: true,
      requireIpLock: true,
      status: 'Undetected',
    });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSaveCheat = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (editingId) {
        // Update existing cheat
        const updateResponse = await getApiClient().put(`/api/admin/cheats/${editingId}`, {
          name: formData.name,
          process: formData.process,
          injection: formData.injection,
          external: formData.external,
          requireHwidLock: formData.requireHwidLock,
          requireIpLock: formData.requireIpLock,
          status: formData.status,
        });

        if (updateResponse.data.status === 'success') {
          // Upload file if provided
          if (file) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            await getApiClient().post(`/api/admin/cheats/${editingId}/file`, fileFormData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          }

          setSuccess('✓ Cheat updated successfully');
          resetForm();
          fetchCheats();
        }
      } else {
        // Create new cheat
        const createResponse = await getApiClient().post('/api/admin/cheats', {
          name: formData.name,
          filename: formData.filename,
          process: formData.process,
          injection: formData.injection,
          external: formData.external,
          requireHwidLock: formData.requireHwidLock,
          requireIpLock: formData.requireIpLock,
          status: formData.status,
        });

        if (createResponse.data.status === 'success') {
          // Upload file if provided
          if (file) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            await getApiClient().post(
              `/api/admin/cheats/${createResponse.data.data.id}/file`,
              fileFormData,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );
          }

          setSuccess('✓ Cheat created successfully');
          resetForm();
          fetchCheats();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cheat: any) => {
    setFormData({
      name: cheat.name,
      filename: cheat.filename,
      process: cheat.process,
      injection: cheat.injection,
      external: cheat.external || false,
      requireHwidLock: cheat.requireHwidLock !== false,
      requireIpLock: cheat.requireIpLock !== false,
      status: cheat.status || 'Undetected',
    });
    setEditingId(cheat.id);
    setShowForm(true);
    setFile(null);
  };

  const handleDelete = async (cheatId: number) => {
    if (!window.confirm('Are you sure you want to delete this cheat? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      const response = await getApiClient().delete(`/api/admin/cheats/${cheatId}`);
      if (response.data.status === 'success') {
        setSuccess('✓ Cheat deleted successfully');
        fetchCheats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete cheat');
    }
  };

  const handleDownloadFile = async (cheatId: number, cheatName: string) => {
    try {
      setError('');
      const response = await getApiClient().get(`/api/admin/cheats/${cheatId}/file`, {
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Get filename from X-Filename header (most reliable)
      let filename = response.headers['x-filename'] || `${cheatName}.bin`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`✓ File downloaded: ${filename}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download file');
    }
  };

  const handleStatusChange = async (cheatId: number, newStatus: string) => {
    try {
      const response = await getApiClient().put(`/api/admin/cheats/${cheatId}/status`, {
        status: newStatus,
      });
      if (response.data.status === 'success') {
        setSuccess('✓ Status updated');
        fetchCheats();
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  return (
    <ProtectedRoute requiredRoles={["god", "owner"]}>
      <div className="space-y-6">
        <AdminPageHeader
          title="Cheat Module Management"
          description="Create and manage cheat modules for available products"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<Code2 className="w-6 h-6 text-purple-600" />}
          action={
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Module
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
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Cheat Module' : 'Create New Cheat Module'}
            </h2>
            <form onSubmit={handleSaveCheat} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Module Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aimbot Module"
                    required
                  />
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Filename</label>
                    <input
                      type="text"
                      value={formData.filename}
                      onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                      placeholder="e.g., aimbot.dll"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Target Process</label>
                  <input
                    type="text"
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    placeholder="e.g., game.exe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Injection Method</label>
                  <input
                    type="text"
                    value={formData.injection}
                    onChange={(e) => setFormData({ ...formData, injection: e.target.value })}
                    placeholder="e.g., DLL Injection"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  >
                    <option value="Undetected">Undetected</option>
                    <option value="Detected">Detected</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Module File {editingId && '(Optional)'}
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".dll,.exe,.bin,.so,.dylib"
                  className="w-full"
                />
                {file && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="external"
                  checked={formData.external}
                  onChange={(e) => setFormData({ ...formData, external: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="external" className="text-sm font-medium cursor-pointer">
                  External Module
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="requireHwidLock"
                  checked={formData.requireHwidLock}
                  onChange={(e) => setFormData({ ...formData, requireHwidLock: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="requireHwidLock" className="text-sm font-medium cursor-pointer">
                  Require HWID Lock
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="requireIpLock"
                  checked={formData.requireIpLock}
                  onChange={(e) => setFormData({ ...formData, requireIpLock: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="requireIpLock" className="text-sm font-medium cursor-pointer">
                  Require IP Lock
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Saving...' : editingId ? 'Update Module' : 'Create Module'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
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
            <p className="text-slate-600 dark:text-slate-400">Loading cheat modules...</p>
          </div>
        ) : cheats.length === 0 ? (
          <div className="card text-center py-16">
            <Code2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">No cheat modules found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cheats.map((cheat) => (
              <div
                key={cheat.id}
                className="card border-l-4 border-l-purple-600 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{cheat.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ID: {cheat.id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      cheat.status === 'Undetected'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {cheat.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 py-3 border-y border-slate-200 dark:border-slate-700">
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Filename:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400 font-mono">
                      {cheat.filename}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Process:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400 font-mono">
                      {cheat.process}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Injection:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      {cheat.injection}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Type:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      {cheat.external ? 'External' : 'Internal'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Security:
                    </span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      {cheat.requireHwidLock ? '🔒 HWID' : '○ HWID'} | {cheat.requireIpLock ? '🔒 IP' : '○ IP'}
                    </span>
                  </div>
                  {cheatFiles[cheat.id] && (
                    <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                        <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                          📦 File Attached
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {cheatFiles[cheat.id].filename} ({(parseInt(cheatFiles[cheat.id].fileSize) / 1024 / 1024).toFixed(2)}MB)
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                          Downloaded {cheatFiles[cheat.id].downloadCount} time(s)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {cheatFiles[cheat.id] && (
                    <button
                      onClick={() => handleDownloadFile(cheat.id, cheat.name)}
                      className="btn-success text-sm flex-1 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                  {cheat.status === 'Undetected' && (
                    <button
                      onClick={() => handleStatusChange(cheat.id, 'Detected')}
                      className="btn-danger text-sm flex-1"
                    >
                      Mark Detected
                    </button>
                  )}
                  {cheat.status === 'Detected' && (
                    <button
                      onClick={() => handleStatusChange(cheat.id, 'Undetected')}
                      className="btn-success text-sm flex-1"
                    >
                      Mark Safe
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(cheat)}
                    className="btn-secondary text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cheat.id)}
                    className="btn-danger text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
