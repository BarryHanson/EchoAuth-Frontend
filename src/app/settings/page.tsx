'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Copy, RefreshCw, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApiSecret();
    }
  }, [user]);

  const fetchApiSecret = async () => {
    try {
      const response = await getApiClient().get('/api/client/api-secret');
      if (response.data.status === 'success') {
        setApiSecret(response.data.data.apiSecret);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load API secret');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSecret = async () => {
    if (!confirm('Are you sure you want to regenerate your API secret? This will invalidate the old secret immediately.')) {
      return;
    }

    try {
      setRegenerating(true);
      setError(null);
      const response = await getApiClient().post('/api/client/api-secret/regenerate', {});
      if (response.data.status === 'success') {
        setApiSecret(response.data.data.apiSecret);
        setSuccess('✅ API secret regenerated successfully');
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to regenerate API secret');
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopySecret = () => {
    if (apiSecret) {
      navigator.clipboard.writeText(apiSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-xl p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-blue-100 mt-2">Manage your program configuration and API access</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600 dark:text-slate-400">Loading settings...</p>
          </div>
        ) : (
          <>
            {/* API Configuration Section */}
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="bg-blue-900/50 p-2 rounded-lg">
                    <span className="text-2xl">🔑</span>
                  </div>
                  API Configuration
                </h2>
                <p className="text-slate-400 mt-2">
                  Your API secret is used to sign requests and verify responses with the EchoAuth API
                </p>
              </div>

              <div className="space-y-4">
                {/* API Secret Display */}
                <div>
                  <label className="block text-sm font-semibold mb-2">API Secret</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm flex items-center justify-between group">
                      <span className={showSecret ? 'text-slate-200' : 'text-slate-500'}>
                        {showSecret ? apiSecret : '••••••••••••••••••••••••••••••••••••••••'}
                      </span>
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-slate-400 hover:text-slate-300 transition opacity-0 group-hover:opacity-100"
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={handleCopySecret}
                      disabled={!apiSecret}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Keep this secret safe. Anyone with this key can access your API.
                  </p>
                </div>

                {/* Regenerate Button */}
                <div className="pt-4 border-t border-slate-700">
                  <button
                    onClick={handleRegenerateSecret}
                    disabled={regenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-700 disabled:opacity-50 text-white rounded-lg transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                    {regenerating ? 'Regenerating...' : 'Regenerate Secret'}
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    ⚠️ This will invalidate all existing API connections. Update your clients immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* API Usage Section */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">API Usage</h3>
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm font-semibold text-slate-300 mb-2">C++ Loader Configuration:</p>
                  <pre className="text-xs text-slate-400 overflow-x-auto">
{`const char* g_api_secret = "${apiSecret || 'YOUR_API_SECRET_HERE'}";

// Use this secret to verify API responses
client.fetch_api_secret();  // Fetch updated secret after auth`}
                  </pre>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm font-semibold text-slate-300 mb-2">Request Signing:</p>
                  <pre className="text-xs text-slate-400 overflow-x-auto">
{`Authorization: Bearer <jwt_token>
X-Signature: <hmac_sha256(response_body, api_secret)>`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Documentation Section */}
            <div className="card bg-blue-900/20 border-blue-700/50">
              <h3 className="text-lg font-bold mb-3 text-blue-200">📖 Documentation</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>✓ API secret is rotated per owner for multi-tenant security</li>
                <li>✓ All responses are signed with HMAC-SHA256 using your API secret</li>
                <li>✓ C++ loader automatically fetches your secret after authentication</li>
                <li>✓ Use the secret to verify response authenticity</li>
                <li>✓ Regenerating creates a new secret immediately (old one becomes invalid)</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
