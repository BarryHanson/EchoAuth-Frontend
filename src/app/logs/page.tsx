'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient, getAllLogs } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import { Loader, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LogsPage() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
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
      } else if (user?.ownerId) {
        // For Owner users, use their ownerId
        setSelectedOwnerId(user.ownerId);
      }
    };
    initializePage();
  }, [user?.role, user?.ownerId]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getAllLogs(50, page * 50);
        if (response.status === 'success') {
          setLogs(response.data.logs);
          setTotal(response.data.total);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  return (
    <ProtectedRoute requiredRoles={["god", "owner", "seller"]}>
      <div className="space-y-6">
        <AdminPageHeader
          title="Activity Logs"
          description="Track all system activities and user actions"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<Activity className="w-6 h-6" />}
        />

        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-slate-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading activity logs...</p>
          </div>
        ) : (
          <div className="card">
            {logs.length === 0 ? (
              <div className="text-center py-16">
                <Activity className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-400 text-lg">No activity logs found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                        <th className="text-left py-3 px-4 font-semibold">HWID</th>
                        <th className="text-left py-3 px-4 font-semibold">Key</th>
                        <th className="text-left py-3 px-4 font-semibold">IP Address</th>
                        <th className="text-left py-3 px-4 font-semibold">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                          <td className="py-3 px-4 text-sm whitespace-nowrap">
                            <span title={new Date(log.createdAt).toLocaleString()}>
                              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">{log.hwid}</td>
                          <td className="py-3 px-4 font-mono text-sm">{log.key || '-'}</td>
                          <td className="py-3 px-4 text-sm">{log.ip}</td>
                          <td className="py-3 px-4 text-sm max-w-xs truncate">{log.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Showing {page * 50 + 1} to {Math.min((page + 1) * 50, total)} of {total} logs
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="btn-secondary disabled:opacity-50 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={(page + 1) * 50 >= total}
                      className="btn-secondary disabled:opacity-50 flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
