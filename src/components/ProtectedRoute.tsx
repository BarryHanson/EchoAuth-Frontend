'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PermissionChecker } from '@/lib/permissions';

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requiredRoles,
  fallback,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user meets permission requirements
    if (requireAdmin) {
      if (!PermissionChecker.canAccessAdmin(user?.role || '')) {
        router.push('/dashboard');
        return;
      }
    }

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user?.role || '')) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, user, router, requireAdmin, requiredRoles, isHydrated]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  // Check permissions before rendering
  if (requireAdmin) {
    if (!PermissionChecker.canAccessAdmin(user?.role || '')) {
      return fallback || null;
    }
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(user?.role || '')) {
      return fallback || null;
    }
  }

  return <>{children}</>;
}
