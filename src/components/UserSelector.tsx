'use client';

import { useState, useEffect } from 'react';
import { getApiClient } from '@/lib/api';
import { ChevronDown } from 'lucide-react';

interface UserSelectorProps {
  selectedUserId: number | null;
  onUserChange: (userId: number) => void;
  ownerId?: number;
}

export default function UserSelector({ selectedUserId, onUserChange, ownerId }: UserSelectorProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getApiClient().get('/api/admin/users');
        if (response.data.status === 'success') {
          setUsers(response.data.data);
          if (!selectedUserId && response.data.data.length > 0) {
            onUserChange(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [ownerId]);

  if (loading) {
    return <div className="text-gray-500">Loading users...</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">View User Stats:</label>
      <div className="relative">
        <select
          value={selectedUserId || ''}
          onChange={(e) => onUserChange(parseInt(e.target.value))}
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg appearance-none cursor-pointer font-medium border border-gray-300 dark:border-gray-600"
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-700 dark:text-gray-300" />
      </div>
    </div>
  );
}
