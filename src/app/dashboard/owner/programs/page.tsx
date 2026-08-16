'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';
import { AlertCircle, Loader, Trash2, CheckCircle, Settings } from 'lucide-react';

interface Program {
  id: number;
  programName: string;
  userId: number;
  createdAt: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApiClient().get('/api/owners');
      if (response.data.status === 'success') {
        setPrograms(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (programId: number, programName: string) => {
    const confirmMsg = `Are you sure you want to delete "${programName}"?\n\nThis will also delete:\n• All license keys for this program\n• All user subscriptions\n• All assigned sellers\n• All related data\n\nThis action cannot be undone!`;

    if (!window.confirm(confirmMsg)) return;

    setDeletingId(programId);
    try {
      const response = await getApiClient().delete('/api/admin/program', {
        data: { ownerId: programId },
      });

      if (response.data.status === 'success') {
        setSuccess(`✓ Program "${programName}" deleted successfully`);
        setPrograms(programs.filter((p) => p.id !== programId));
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete program');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute requiredRoles={['owner', 'god']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Programs</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and delete your programs</p>
        </div>

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

        {/* Programs List */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading programs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {programs.length === 0 ? (
              <div className="card text-center py-12">
                <Settings className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">No programs yet</p>
                <Link href="/loaders">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors inline-block">
                    Create First Program
                  </button>
                </Link>
              </div>
            ) : (
              programs.map((program) => (
                <div
                  key={program.id}
                  className="card bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {program.programName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Created: {new Date(program.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteProgram(program.id, program.programName)}
                      disabled={deletingId === program.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === program.id ? 'Deleting...' : 'Delete Program'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Banner */}
        {programs.length > 0 && (
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-yellow-600 dark:text-yellow-400 font-bold mb-2">⚠️ Danger Zone</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Deleting a program will permanently remove all associated data including keys, user subscriptions, and sellers.
              This action cannot be undone. Please proceed with caution.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
