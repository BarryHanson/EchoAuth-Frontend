'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Shield, Home } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { DocsSearch } from '@/components/DocsSearch';

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const sections = [
    { title: 'Getting Started', href: '/documentation' },
    {
      title: 'C++ Library',
      items: [
        { title: 'Overview', href: '/documentation/cpp-library' },
        { title: 'Installation & Build', href: '/documentation/cpp-library/installation' },
        { title: 'Authentication', href: '/documentation/cpp-library/authentication' },
        { title: 'Cryptography', href: '/documentation/cpp-library/cryptography' },
        { title: 'Downloading Cheats', href: '/documentation/cpp-library/downloading-cheats' },
        { title: 'Error Handling', href: '/documentation/cpp-library/error-handling' },
        { title: 'Best Practices', href: '/documentation/cpp-library/best-practices' },
      ],
    },
    {
      title: 'C++ Loader',
      items: [
        { title: 'Overview', href: '/documentation/cpp-loader' },
        { title: 'Configuration', href: '/documentation/cpp-loader/configuration' },
        { title: 'Workflow', href: '/documentation/cpp-loader/workflow' },
        { title: 'Security Features', href: '/documentation/cpp-loader/security' },
        { title: 'Troubleshooting', href: '/documentation/cpp-loader/troubleshooting' },
      ],
    },
    {
      title: 'API Reference',
      items: [
        { title: 'Overview', href: '/documentation/api-reference' },
        { title: 'Authentication', href: '/documentation/api-reference/authentication' },
        { title: 'Client Endpoints', href: '/documentation/api-reference/client' },
        { title: 'Admin Endpoints', href: '/documentation/api-reference/admin' },
      ],
    },
    {
      title: 'Security',
      href: '/documentation/security',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 overflow-y-auto`}
      >
        <div className="p-6">
          <Link href="/documentation" className="flex items-center gap-2 hover:opacity-80 transition">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-white">EchoAuth Docs</span>
          </Link>
        </div>

        <nav className="px-4 py-2">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {section.href ? (
                <Link
                  href={section.href}
                  className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  {section.title}
                </Link>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items?.map((item, i) => (
                      <li key={i}>
                        <Link
                          href={item.href}
                          className="text-sm text-slate-400 hover:text-slate-300 transition block py-1"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar - Similar to Landing Page */}
        <nav className="sticky top-0 z-30 border-b border-slate-700/50 bg-slate-950/75 backdrop-blur-xl">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-slate-400 hover:text-white transition"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                <Home className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-white text-sm">Home</span>
              </Link>
            </div>

            <DocsSearch />

            <div className="flex items-center gap-4">
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-slate-300 hover:border-slate-600 focus:outline-none focus:border-cyan-500">
                <option value="cpp">C++ (Recommended)</option>
                <option value="python" disabled>Python (Coming Soon)</option>
                <option value="csharp" disabled>C# (Coming Soon)</option>
                <option value="java" disabled>Java (Coming Soon)</option>
              </select>

              {isAuthenticated ? (
                <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition shadow-lg shadow-blue-900/50 text-sm">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-slate-300 hover:text-white transition text-sm">
                    Log In
                  </Link>
                  <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition shadow-lg shadow-blue-900/50 text-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="px-4 lg:px-8 py-12 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
