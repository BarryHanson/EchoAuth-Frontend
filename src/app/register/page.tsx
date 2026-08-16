'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { AlertCircle, CheckCircle, Loader, UserPlus, CheckCheck } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register(username, password);

      if (response.status === 'success') {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const validateUsername = username.length >= 3;
  const validatePassword = password.length >= 6;
  const validateMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <UserPlus className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">EchoAuth</h1>
            </div>
            <p className="text-center text-green-100 text-sm">Create Your Account</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg flex gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                  placeholder="Choose a username"
                  minLength={3}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50"
                />
                {username && (
                  <p className={`mt-1 text-xs flex items-center gap-1 ${validateUsername ? 'text-green-400' : 'text-slate-400'}`}>
                    {validateUsername && <CheckCheck className="w-3 h-3" />}
                    At least 3 characters
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Create a password"
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50"
                />
                {password && (
                  <p className={`mt-1 text-xs flex items-center gap-1 ${validatePassword ? 'text-green-400' : 'text-slate-400'}`}>
                    {validatePassword && <CheckCheck className="w-3 h-3" />}
                    At least 6 characters
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Confirm your password"
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50"
                />
                {confirmPassword && (
                  <p className={`mt-1 text-xs flex items-center gap-1 ${validateMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {validateMatch && <CheckCheck className="w-3 h-3" />}
                    {validateMatch ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-xs text-slate-400">Already have an account?</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-300">
              <Link href="/login" className="font-semibold text-green-400 hover:text-green-300 transition">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50">
            <p className="text-center text-xs text-slate-400">
              New accounts are created as program owners with a default program included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
