'use client';

import { useAuthStore } from '@/stores/authStore';
import OwnerSelector from './OwnerSelector';
import { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  selectedOwnerId?: number | null;
  onOwnerChange?: (ownerId: number) => void;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  selectedOwnerId,
  onOwnerChange,
  icon,
  action,
}: AdminPageHeaderProps) {
  const { user } = useAuthStore();
  const isGod = user?.role === 'god';

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>

      {/* Owner Selector for God Admin on all pages */}
      {isGod && onOwnerChange && selectedOwnerId !== undefined && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <OwnerSelector
            selectedOwnerId={selectedOwnerId}
            onOwnerChange={onOwnerChange}
          />
        </div>
      )}
    </div>
  );
}
