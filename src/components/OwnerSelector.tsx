'use client';

import { useState, useEffect } from 'react';
import { getApiClient } from '@/lib/api';
import { ChevronDown } from 'lucide-react';

interface OwnerSelectorProps {
  selectedOwnerId: number | null;
  onOwnerChange: (ownerId: number) => void;
}

export default function OwnerSelector({ selectedOwnerId, onOwnerChange }: OwnerSelectorProps) {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await getApiClient().get('/api/owners');
        if (response.data.status === 'success') {
          setOwners(response.data.data);
          if (!selectedOwnerId && response.data.data.length > 0) {
            onOwnerChange(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch owners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading owners...</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Owner:</label>
      <div className="relative">
        <select
          value={selectedOwnerId || ''}
          onChange={(e) => onOwnerChange(parseInt(e.target.value))}
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg appearance-none cursor-pointer font-medium border border-gray-300 dark:border-gray-600"
        >
          <option value="">-- Select an owner --</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.programName} (ID: {owner.id})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-700 dark:text-gray-300" />
      </div>
    </div>
  );
}
