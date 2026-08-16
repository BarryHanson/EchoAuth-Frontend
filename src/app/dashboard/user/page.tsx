'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';

interface Subscription {
  id: number;
  keyId: number;
  program: {
    id: number;
    programName: string;
    programSlug: string;
  };
  key: {
    id: number;
    keyValue: string;
    status: string;
    hwid: string | null;
    lastIp: string | null;
  };
  subscription: {
    activatedAt: string | null;
    expiresAt: string | null;
    remainingDays: number | null;
    remainingSeconds: number | null;
    isActive: boolean;
  };
  resets: {
    hwid: {
      lastReset: string | null;
      canReset: boolean;
      hoursRemaining: number;
    };
    ip: {
      lastReset: string | null;
      canReset: boolean;
      hoursRemaining: number;
    };
  };
}

export default function UserDashboard() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [resettingHwid, setResettingHwid] = useState(false);
  const [resettingIp, setResettingIp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      const response = await getApiClient().get('/api/registration/my-subscription');
      if (response.data.status === 'success') {
        setSubscription(response.data.data);
        setError(null);
      } else {
        setError('Failed to load subscription');
      }
    } catch (err) {
      setError('Error loading subscription data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleActivate = async () => {
    try {
      setActivating(true);
      setError(null);
      const response = await getApiClient().post('/api/registration/activate', {});
      if (response.data.status === 'success') {
        setSuccessMessage('✅ Subscription activated! Your countdown has started.');
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchSubscription();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate subscription');
    } finally {
      setActivating(false);
    }
  };

  const handleResetHwid = async () => {
    if (!confirm('Reset your HWID binding? This will clear the current binding.')) return;
    try {
      setResettingHwid(true);
      setError(null);
      const response = await getApiClient().post('/api/registration/reset-hwid', {});
      if (response.data.status === 'success') {
        setSuccessMessage('✅ HWID reset successfully. Next reset available in 24 hours.');
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchSubscription();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset HWID');
    } finally {
      setResettingHwid(false);
    }
  };

  const handleResetIp = async () => {
    if (!confirm('Reset your IP binding? This will clear the current binding.')) return;
    try {
      setResettingIp(true);
      setError(null);
      const response = await getApiClient().post('/api/registration/reset-ip', {});
      if (response.data.status === 'success') {
        setSuccessMessage('✅ IP reset successfully. Next reset available in 24 hours.');
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchSubscription();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset IP');
    } finally {
      setResettingIp(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['user']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading subscription...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !subscription) {
    return (
      <ProtectedRoute requiredRoles={['user']}>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">{error || 'No active subscription found'}</p>
              <p className="text-gray-400 text-sm">
                Please contact support if you believe this is an error.
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const expiresDate = subscription.subscription.expiresAt
    ? new Date(subscription.subscription.expiresAt)
    : null;
  const activatedDate = subscription.subscription.activatedAt
    ? new Date(subscription.subscription.activatedAt)
    : null;
  const days = subscription.subscription.remainingDays || 0;
  const isActivated = !!subscription.subscription.activatedAt;
  const isExpired = isActivated && !subscription.subscription.isActive;
  const isExpiringSoon = isActivated && days > 0 && days < 7;

  const getStatusColor = () => {
    if (isExpired) return 'text-red-400';
    if (isExpiringSoon) return 'text-yellow-400';
    if (isActivated) return 'text-green-400';
    return 'text-gray-400';
  };

  const getStatusBg = () => {
    if (isExpired) return 'bg-red-500/10 border-red-500/20';
    if (isExpiringSoon) return 'bg-yellow-500/10 border-yellow-500/20';
    if (isActivated) return 'bg-green-500/10 border-green-500/20';
    return 'bg-slate-500/10 border-slate-500/20';
  };

  const getStatusText = () => {
    if (!isActivated) return 'NOT YET ACTIVATED';
    if (isExpired) return 'EXPIRED';
    if (isExpiringSoon) return 'EXPIRING SOON';
    return 'ACTIVE';
  };

  return (
    <ProtectedRoute requiredRoles={['user']}>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Subscription</h1>
            <p className="text-gray-400">Manage and monitor your active license</p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              ❌ {error}
            </div>
          )}

          {/* Activation Banner */}
          {!subscription.subscription.activatedAt && (
            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-semibold mb-1">⏱️ Subscription Not Yet Activated</p>
                  <p className="text-gray-400 text-sm">
                    Click the button below to activate your subscription and start your countdown!
                  </p>
                </div>
                <button
                  onClick={handleActivate}
                  disabled={activating}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors whitespace-nowrap ml-4"
                >
                  {activating ? '⏳ Activating...' : '🚀 Activate Now'}
                </button>
              </div>
            </div>
          )}

          {/* Status Card */}
          <div className={`border rounded-lg p-6 mb-6 ${getStatusBg()}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Status</p>
                <p className={`text-2xl font-bold ${getStatusColor()}`}>{getStatusText()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Days Remaining</p>
                <p className={`text-4xl font-bold ${getStatusColor()}`}>
                  {subscription.subscription.activatedAt ? days : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Program Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Program Details */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600/50 transition-colors">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">Program</p>
              <p className="text-xl font-semibold text-white mb-4">
                {subscription.program.programName}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <span className="w-32">Program ID:</span>
                  <span className="text-gray-300">{subscription.program.id}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <span className="w-32">Slug:</span>
                  <span className="text-gray-300 font-mono">{subscription.program.programSlug}</span>
                </div>
              </div>
            </div>

            {/* Key Details */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600/50 transition-colors">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">Your Key</p>
              <p className="text-lg font-mono text-blue-400 mb-4 break-all">
                {subscription.key.keyValue}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <span className="w-20">Status:</span>
                  <span className={subscription.key.status === 'activated' ? 'text-green-400' : 'text-gray-300'}>
                    {subscription.key.status.charAt(0).toUpperCase() + subscription.key.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Timeline */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">Subscription Timeline</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Activated</span>
                  <span className="text-white font-mono">
                    {activatedDate ? `${activatedDate.toLocaleDateString()} ${activatedDate.toLocaleTimeString()}` : 'Not yet activated'}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Expires</span>
                  <span className={`font-mono font-semibold ${getStatusColor()}`}>
                    {expiresDate ? `${expiresDate.toLocaleDateString()} ${expiresDate.toLocaleTimeString()}` : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time Remaining</span>
                  <span className={`text-lg font-bold ${getStatusColor()}`}>
                    {subscription.subscription.activatedAt
                      ? `${days} days (${Math.floor((subscription.subscription.remainingSeconds || 0) / 3600)} hours)`
                      : 'Not activated'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hardware & IP Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HWID */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Hardware ID</p>
                <button
                  onClick={handleResetHwid}
                  disabled={resettingHwid || !subscription.resets.hwid.canReset}
                  title={
                    subscription.resets.hwid.canReset
                      ? 'Reset HWID binding'
                      : `Reset available in ${subscription.resets.hwid.hoursRemaining} hour${subscription.resets.hwid.hoursRemaining !== 1 ? 's' : ''}`
                  }
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    subscription.resets.hwid.canReset
                      ? 'bg-blue-600/40 hover:bg-blue-600/60 text-blue-300 cursor-pointer'
                      : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {resettingHwid
                    ? '⏳ Resetting...'
                    : subscription.resets.hwid.canReset
                    ? '↻ Reset'
                    : `${subscription.resets.hwid.hoursRemaining}h`}
                </button>
              </div>
              {subscription.session?.hwid || subscription.key.hwid ? (
                <div>
                  <p className="text-white font-mono text-sm break-all mb-2">
                    {subscription.session?.hwid || subscription.key.hwid}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {subscription.session?.hwid ? 'Locked to this hardware (session)' : 'Bound to your hardware'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm">Not yet bound</p>
                  <p className="text-gray-500 text-xs">Will be set on first login</p>
                </div>
              )}
            </div>

            {/* Last IP */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Last IP Address</p>
                <button
                  onClick={handleResetIp}
                  disabled={resettingIp || !subscription.resets.ip.canReset}
                  title={
                    subscription.resets.ip.canReset
                      ? 'Reset IP binding'
                      : `Reset available in ${subscription.resets.ip.hoursRemaining} hour${subscription.resets.ip.hoursRemaining !== 1 ? 's' : ''}`
                  }
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    subscription.resets.ip.canReset
                      ? 'bg-blue-600/40 hover:bg-blue-600/60 text-blue-300 cursor-pointer'
                      : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {resettingIp
                    ? '⏳ Resetting...'
                    : subscription.resets.ip.canReset
                    ? '↻ Reset'
                    : `${subscription.resets.ip.hoursRemaining}h`}
                </button>
              </div>
              {subscription.session?.ipAddress || subscription.key.lastIp ? (
                <div>
                  <p className="text-white font-mono text-sm mb-2">
                    {subscription.session?.ipAddress || subscription.key.lastIp}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {subscription.session?.ipAddress ? 'Locked to this IP (session)' : 'Last access from this IP'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm">No access yet</p>
                  <p className="text-gray-500 text-xs">Will be recorded on first login</p>
                </div>
              )}
            </div>
          </div>

          {/* Warning Banner */}
          {isExpiringSoon && !isExpired && (
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold">⚠️ Your subscription is expiring soon!</p>
              <p className="text-gray-400 text-sm mt-1">
                Renew your subscription to maintain access.
              </p>
            </div>
          )}

          {isExpired && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 font-semibold">❌ Your subscription has expired</p>
              <p className="text-gray-400 text-sm mt-1">
                Contact support to renew your subscription and regain access.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
