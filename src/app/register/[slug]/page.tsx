'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getApiClient } from '@/lib/api';

interface ProgramInfo {
  id: number;
  programName: string;
  programSlug: string;
}

export default function ProgramRegisterPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const token = searchParams.get('token');
  const type = (searchParams.get('type') as 'user' | 'seller') || 'user';

  const [program, setProgram] = useState<ProgramInfo | null>(null);
  const [registrationType, setRegistrationType] = useState<'user' | 'seller'>(type);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchProgramInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // For user registration (no token), just fetch program by slug
        if (registrationType === 'user') {
          const response = await getApiClient().get(`/api/registration/program?slug=${slug}`);
          if (response.data.status === 'success') {
            setProgram(response.data.data);
          } else {
            setError('Program not found');
          }
        }
        // For seller registration (with token), validate token
        else if (token) {
          const response = await getApiClient().get(`/api/registration/token-info?token=${token}`);
          if (response.data.status === 'success') {
            setProgram(response.data.data.owner);
          } else {
            setError('Invalid or expired registration link');
          }
        } else {
          setError('Registration link is invalid or expired');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load program information');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramInfo();
  }, [slug, token, registrationType]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registrationType === 'user' && !keyValue.trim()) {
      setError('Key value is required');
      return;
    }

    if (registrationType === 'seller' && !token) {
      setError('Registration link is invalid or expired');
      return;
    }

    try {
      setRegistering(true);

      // Register the user
      const registerResponse = await getApiClient().post('/api/auth/register', {
        username,
        password,
        role: registrationType,
      });

      if (registerResponse.data.status === 'success') {
        const userId = registerResponse.data.data?.id;

        // If user registration with key, link the key to their account
        if (registrationType === 'user' && keyValue && userId) {
          try {
            const linkResponse = await getApiClient().post('/api/registration/link-key-direct', {
              keyValue,
              userId,
              programSlug: slug,
            });

            if (linkResponse.data.status === 'success') {
              setSuccess(
                `✅ Registration successful! Your key has been linked to your account. Log in to activate it.`
              );
              setTimeout(() => {
                router.push('/login');
              }, 2000);
            }
          } catch (linkErr: any) {
            setError(
              linkErr.response?.data?.message || 'Failed to link key. Please contact support.'
            );
          }
        }
        // For seller registration with token
        else if (registrationType === 'seller' && token && userId) {
          try {
            const linkResponse = await getApiClient().post('/api/registration/link-seller-token', {
              token,
              userId,
            });

            if (linkResponse.data.status === 'success') {
              setSuccess(
                `✅ Registration successful! You can now log in.`
              );
              setTimeout(() => {
                router.push('/login');
              }, 2000);
            }
          } catch (linkErr: any) {
            setError(
              linkErr.response?.data?.message || 'Failed to activate seller account. Please contact support.'
            );
          }
        } else {
          setSuccess(`✅ Registration successful! You can now login with your credentials.`);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading registration page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Program Header */}
        {program && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{program.programName}</h1>
            <p className="text-gray-400">
              {registrationType === 'user' ? 'User Registration' : 'Seller Registration'}
            </p>
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Success Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50"
                disabled={registering}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50"
                disabled={registering}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50"
                disabled={registering}
              />
            </div>

            {/* Key (only for user registration) */}
            {registrationType === 'user' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Key</label>
                <input
                  type="text"
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  placeholder="Enter your purchased key"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50"
                  disabled={registering}
                />
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={registering}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded transition-all duration-200 mt-6"
            >
              {registering ? '⏳ Registering...' : '✨ Register'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Log in here
            </a>
          </p>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Questions? Contact the program support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
