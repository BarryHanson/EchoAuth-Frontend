'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPageHeader from '@/components/AdminPageHeader';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { LinkIcon } from 'lucide-react';

interface RegistrationLink {
  id: number;
  token: string;
  type: 'user' | 'seller';
  isUsed: boolean;
  usedAt?: string;
  usedById?: string;
  maxKeysLimit?: number;
  programSlug: string;
  createdAt: string;
  key?: {
    key: string;
  };
}

interface Program {
  id: number;
  programSlug: string;
  programName: string;
}

export default function RegistrationLinksPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [links, setLinks] = useState<RegistrationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatingSellerToken, setGeneratingSellerToken] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [owners, setOwners] = useState<any[]>([]);

  // Form state
  const [sellerKeyLimit, setSellerKeyLimit] = useState('100');

  // Get base URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  };

  const getSellerRegistrationLink = (token: string, slug: string) => {
    return `${getBaseUrl()}/register/${slug}?token=${token}&type=seller`;
  };

  useEffect(() => {
    // Wait for auth to be ready before fetching
    if (token && user) {
      initializePage();
    } else if (!token) {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    // Fetch data when selectedOwnerId changes
    if (selectedOwnerId) {
      fetchData(selectedOwnerId);
    }
  }, [selectedOwnerId]);

  const initializePage = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user?.role === 'god') {
        // For God users, fetch owners
        const ownersResponse = await getApiClient().get('/api/owners');
        if (ownersResponse.data.status === 'success') {
          setOwners(ownersResponse.data.data);
          if (ownersResponse.data.data.length > 0) {
            const firstOwner = ownersResponse.data.data[0];
            setSelectedOwnerId(firstOwner.id);
          }
        }
      } else if (user?.ownerId) {
        // For Owner users, use their ownerId
        setSelectedOwnerId(user.ownerId);
      } else {
        setError('No ownerId found. You must be an owner.');
        setLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (ownerId?: number) => {
    const ownerToUse = ownerId || selectedOwnerId;
    if (!ownerToUse) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all programs for this owner
      const programsResponse = await getApiClient().get('/api/owners', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (programsResponse.data.status === 'success') {
        const ownerPrograms = programsResponse.data.data;
        setPrograms(ownerPrograms);

        // Auto-select first program
        if (ownerPrograms.length > 0) {
          setSelectedProgram(ownerPrograms[0]);
        }
      }

      // Get registration links for the selected owner ID
      const linksResponse = await getApiClient().get(`/api/registration/tokens/${ownerToUse}`);
      if (linksResponse.data.status === 'success') {
        setLinks(linksResponse.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSellerLink = async () => {
    if (!selectedProgram) {
      setError('Please select a program');
      return;
    }

    try {
      setGeneratingSellerToken(true);
      setError(null);

      const response = await getApiClient().post('/api/registration/tokens/seller', {
        maxKeysLimit: parseInt(sellerKeyLimit),
        ownerId: selectedProgram.id,
      });

      if (response.data.status === 'success') {
        setSuccessMessage('✅ Seller registration link generated!');
        setTimeout(() => setSuccessMessage(null), 5000);
        setSellerKeyLimit('100');
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate link');
    } finally {
      setGeneratingSellerToken(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setSuccessMessage('✅ Link copied to clipboard!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm('Delete this registration link?')) return;

    try {
      setError(null);
      const response = await getApiClient().delete('/api/registration/tokens', {
        data: { tokenId: linkId },
      });

      if (response.data.status === 'success') {
        setSuccessMessage('✅ Link deleted');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete link');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['owner', 'god']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading registration links...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['owner', 'god']}>
      <div className="space-y-6">
        <AdminPageHeader
          title="Registration Links"
          description="Generate seller registration links and share user registration URLs"
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          icon={<LinkIcon className="w-6 h-6" />}
        />

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

        {/* User Registration URL Info */}
        {programs.length > 0 && (
          <div className="mb-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <p className="text-blue-400 font-semibold mb-4">👤 User Registration URLs</p>
            <p className="text-gray-400 text-sm mb-4">
              Share these simple links with your customers to register and use their purchased keys:
            </p>
            <div className="space-y-2">
              {programs.map((program) => (
                <div key={program.id} className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                  <p className="text-gray-300 font-semibold text-sm mb-2">{program.programName}</p>
                  <p className="text-gray-300 font-mono text-xs break-all">
                    {getBaseUrl()}/register/<span className="text-blue-400">{program.programSlug}</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              These URLs are permanent and public. Customers can register and enter their purchased keys.
            </p>
          </div>
        )}

        {/* Generate Seller Link Section */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">🛒 Generate Seller Registration Link</h2>
          <p className="text-gray-400 text-sm mb-6">
            Create a registration link for resellers to join and generate keys for a specific program.
          </p>

          <div className="space-y-4">
            {/* Program Selector */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Select Program</label>
              <select
                value={selectedProgram?.id || ''}
                onChange={(e) => {
                  const program = programs.find((p) => p.id === parseInt(e.target.value));
                  setSelectedProgram(program || null);
                }}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400/50"
              >
                <option value="">-- Select a program --</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.programName}
                  </option>
                ))}
              </select>
              {programs.length === 0 && (
                <p className="text-gray-500 text-xs mt-1">No programs found. Create a program first.</p>
              )}
            </div>

            {/* Max Keys Limit */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Max Keys Limit</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={sellerKeyLimit}
                onChange={(e) => setSellerKeyLimit(e.target.value)}
                disabled={generatingSellerToken}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400/50"
              />
              <p className="text-gray-500 text-xs mt-1">How many keys this seller can generate</p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateSellerLink}
              disabled={generatingSellerToken || !selectedProgram}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded transition-all duration-200"
            >
              {generatingSellerToken ? '⏳ Generating...' : '✨ Generate Seller Link'}
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-white">📋 Your Registration Links</h2>
            <p className="text-gray-400 text-sm mt-1">{links.length} links total</p>
          </div>

          {links.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No registration links created yet. Generate one above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700/50 bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Link</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Created</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded text-xs font-semibold border ${
                          link.type === 'seller'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {link.type === 'seller' ? '🛒 Seller' : '❌ Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-300 text-xs font-mono">
                        {link.token.slice(0, 16)}...
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded text-xs font-semibold border ${
                          link.isUsed
                            ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {link.isUsed ? '✓ Used' : '○ Available'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-400 text-xs">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 space-x-2">
                        {link.type === 'seller' && (
                          <button
                            onClick={() =>
                              handleCopyLink(getSellerRegistrationLink(link.token, link.programSlug))
                            }
                            className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
                          >
                            Copy
                          </button>
                        )}
                        {!link.isUsed && (
                          <>
                            <span className="text-gray-600">|</span>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="text-red-400 hover:text-red-300 transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-400 font-semibold">ℹ️ How It Works</p>
          <ul className="text-gray-400 text-sm mt-2 space-y-1">
            <li>• User links are simple, permanent URLs based on your program slug</li>
            <li>• Share user links directly with your customers without tokens</li>
            <li>• Generate seller links for resellers who will manage their own registrations</li>
            <li>• Each seller link is one-time use and becomes inactive after registration</li>
            <li>• Delete unused seller links to keep your account clean</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
