'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Lock, Zap, Users, Code, BarChart3, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [isAuthHydrated, setIsAuthHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsAuthHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setIsAuthHydrated(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Multi-layer protection with HWID locking, IP locking, and timestamp validation to prevent tampering.',
    },
    {
      icon: Lock,
      title: 'Encrypted Modules',
      description: 'XOR symmetric encryption for module obfuscation and secure distribution from memory.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ultra-low latency authentication and module delivery optimized for performance.',
    },
    {
      icon: Users,
      title: 'Multi-Tenant',
      description: 'Complete isolation between owners with per-owner API secrets and granular access control.',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Easy integration with JWT authentication and comprehensive API documentation.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Logs',
      description: 'Real-time monitoring, detailed logging, and insights into user activity and security events.',
    },
  ];

  const threats = [
    {
      title: 'Clock Tampering',
      description: 'Detect when users roll back system clocks to extend trial periods.',
      protection: 'Timestamp drift detection with 5-minute tolerance',
    },
    {
      title: 'HWID Spoofing',
      description: 'Prevent users from using cheats on multiple machines with session locking.',
      protection: 'Hardware profile GUID validation',
    },
    {
      title: 'IP Manipulation',
      description: 'Lock cheats to specific networks and detect suspicious access patterns.',
      protection: 'IP address binding per session',
    },
  ];

  const metrics = [
    { value: '2.4M', label: 'Requests' },
    { value: '42ms', label: 'Latency' },
    { value: '31.2k', label: 'Active Sessions' },
    { value: '99.99%', label: 'Uptime' },
  ];

  const steps = [
    {
      title: 'Create Your Account',
      description: 'Spin up your workspace and generate your first owner key in minutes.',
    },
    {
      title: 'Configure Your App',
      description: 'Define license rules, HWID limits, and subscription tiers for your product.',
    },
    {
      title: 'Integrate And Launch',
      description: 'Drop in the API, validate sessions server-side, and ship with confidence.',
    },
  ];

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen -mt-8 min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.18),transparent_42%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(34,211,238,0.13),transparent_38%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(2,6,23,0.45)_60%,rgba(2,6,23,0.85)_100%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-700/50 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">EchoAuth</span>
            </Link>

            <div className="flex items-center gap-4 sm:gap-8">
              <a href="#features" className="hidden sm:inline text-slate-300 hover:text-white transition">Features</a>
              <a href="#security" className="hidden sm:inline text-slate-300 hover:text-white transition">Security</a>
              <a href="#numbers" className="hidden sm:inline text-slate-300 hover:text-white transition">Numbers</a>
              <div className="flex items-center gap-3 min-w-[170px] justify-end">
                {!isAuthHydrated ? (
                  <div className="h-10 w-[170px] rounded-lg border border-slate-700/50 bg-slate-800/40 animate-pulse" />
                ) : isAuthenticated ? (
                  <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition shadow-lg shadow-blue-900/50">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="text-slate-300 hover:text-white transition px-4 py-2">
                      Log In
                    </Link>
                    <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition shadow-lg shadow-blue-900/50">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center pt-24 pb-16">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              Authentication made for everyone
            </div>

            <h1 className="mx-auto mb-6 max-w-5xl text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Secure, scalable, and game-changing authentication for your applications.
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-lg text-slate-300 sm:text-xl">
              Ship with enterprise-level controls in minutes. Protect keys, enforce HWID policies, and validate every session through server-side truth.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href={isAuthenticated ? '/dashboard' : '/login'} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/50 transition hover:from-blue-500 hover:to-cyan-500">
                {isAuthenticated ? 'Open Dashboard' : 'Start For Free'}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-900/45 px-8 py-4 font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800/60">
                View Features
              </a>
            </div>

            <div className="mt-14 rounded-2xl border border-slate-700/60 bg-slate-900/65 p-3 shadow-2xl shadow-slate-950/80">
              <div className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 sm:p-8">
                <div className="mb-6 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                  <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 p-3">
                    <p className="text-xs uppercase tracking-wide text-blue-300">Requests</p>
                    <p className="mt-1 text-xl font-semibold text-white">2.4M</p>
                  </div>
                  <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-3">
                    <p className="text-xs uppercase tracking-wide text-cyan-300">Latency</p>
                    <p className="mt-1 text-xl font-semibold text-white">42ms</p>
                  </div>
                  <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 p-3">
                    <p className="text-xs uppercase tracking-wide text-blue-300">Active Sessions</p>
                    <p className="mt-1 text-xl font-semibold text-white">31.2k</p>
                  </div>
                  <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-3">
                    <p className="text-xs uppercase tracking-wide text-cyan-300">Uptime</p>
                    <p className="mt-1 text-xl font-semibold text-white">99.99%</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {['HWID lock', 'Token gate', 'Webhook alerts'].map((item) => (
                    <div key={item} className="rounded-lg border border-slate-700/60 bg-slate-800/65 p-4 text-left">
                      <p className="text-sm font-medium text-slate-200">{item}</p>
                      <p className="mt-1 text-xs text-slate-400">Enabled and synced globally.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 rounded-xl border border-slate-700/50 bg-slate-900/55 p-4 sm:grid-cols-4">
              {['C++', 'C#', 'Rust', 'Go', 'Node', 'Python', 'Lua', 'Web'].map((lang) => (
                <div key={lang} className="rounded-lg border border-slate-700/60 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-300">
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 w-full py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A complete suite for authentication, monetization, and secure user operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group rounded-xl border border-slate-700/50 bg-slate-900/55 backdrop-blur-xl p-6 hover:border-cyan-400/50 hover:bg-slate-800/80 transition">
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-fit group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Threat Scenarios */}
      <section id="security" className="relative z-10 w-full py-24 bg-slate-900/45 border-y border-slate-800/70">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">See how we block attacks</h2>
            <p className="text-xl text-slate-400">Threat-focused workflows with clear outcomes and audit trails.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {threats.map((threat, i) => (
              <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-900/65 backdrop-blur-xl p-8">
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 w-fit">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{threat.title}</h3>
                <p className="text-slate-400 mb-4 text-sm">{threat.description}</p>
                <div className="flex items-start gap-2 text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{threat.protection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="numbers" className="relative z-10 w-full py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Numbers don&apos;t lie</h2>
            <p className="text-lg text-slate-400">Built for scale with performance you can trust.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">{metric.value}</div>
                <div className="text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="relative z-10 w-full py-24 bg-slate-900/35 border-y border-slate-800/70">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get Started in 3 Steps</h2>
            <p className="text-lg text-slate-400">No complex migration required. Launch quickly with practical defaults.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-700/50 bg-slate-900/65 p-7">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/35 bg-blue-500/15 text-sm font-semibold text-blue-300">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to secure your application?</h2>
              <p className="text-xl text-slate-300 mb-8">Start building with EchoAuth today. Get production-ready authentication in minutes.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={isAuthenticated ? '/dashboard' : '/login'} className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/50">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="mailto:support@echoauth.dev" className="px-8 py-4 rounded-lg border border-slate-600 hover:border-slate-500 text-white font-semibold transition hover:bg-slate-700/50">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-700/50 py-12 bg-slate-900/80">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-white">EchoAuth</span>
              </div>
              <p className="text-slate-400 text-sm">Enterprise authentication platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#security" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">&copy; 2026 EchoAuth. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition text-sm">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition text-sm">Discord</a>
              <a href="#" className="text-slate-400 hover:text-white transition text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
