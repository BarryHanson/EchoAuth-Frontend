'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Lock, Shield, Code } from 'lucide-react';

export default function DocumentationHome() {
  return (
    <div className="max-w-4xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          EchoAuth Documentation
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Complete guide to integrating EchoAuth authentication into your applications.
          Learn how to secure user sessions, manage licenses, and deliver encrypted cheat modules.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Link
          href="/documentation/cpp-library"
          className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-cyan-600/50 transition"
        >
          <div className="flex items-start justify-between mb-3">
            <Code className="w-6 h-6 text-blue-400" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition" />
          </div>
          <h3 className="font-semibold text-white mb-2">C++ Library</h3>
          <p className="text-sm text-slate-400">
            Learn how to use the EchoAuth C++ client library for authentication and secure communication.
          </p>
        </Link>

        <Link
          href="/documentation/cpp-loader"
          className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-cyan-600/50 transition"
        >
          <div className="flex items-start justify-between mb-3">
            <Zap className="w-6 h-6 text-orange-400" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition" />
          </div>
          <h3 className="font-semibold text-white mb-2">C++ Loader</h3>
          <p className="text-sm text-slate-400">
            Understand the loader workflow, security features, and how to integrate it into your application.
          </p>
        </Link>

        <Link
          href="/documentation/api-reference"
          className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-cyan-600/50 transition"
        >
          <div className="flex items-start justify-between mb-3">
            <Lock className="w-6 h-6 text-green-400" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition" />
          </div>
          <h3 className="font-semibold text-white mb-2">API Reference</h3>
          <p className="text-sm text-slate-400">
            Complete reference for all EchoAuth API endpoints with request/response examples.
          </p>
        </Link>

        <Link
          href="/documentation/security"
          className="group p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-cyan-600/50 transition"
        >
          <div className="flex items-start justify-between mb-3">
            <Shield className="w-6 h-6 text-red-400" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition" />
          </div>
          <h3 className="font-semibold text-white mb-2">Security Practices</h3>
          <p className="text-sm text-slate-400">
            Learn about EchoAuth's security features and best practices for protecting user data.
          </p>
        </Link>
      </div>

      {/* Introduction */}
      <div className="prose prose-invert max-w-none mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">What is EchoAuth?</h2>
        <p className="text-slate-300 mb-6">
          EchoAuth is a professional authentication and license management platform designed for secure user sessions,
          hardware-based access control, and encrypted module delivery. It provides enterprise-grade security features
          including HWID locking, IP locking, timestamp validation, and JWT-based authentication.
        </p>

        <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>JWT Authentication:</strong> Secure token-based authentication with automatic expiration and refresh</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>HWID Locking:</strong> Bind user sessions to specific machine hardware for license protection</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>IP Locking:</strong> Optional IP-based session restrictions to detect unauthorized access</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Timestamp Validation:</strong> Detect and prevent system clock tampering attempts</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>XOR Encryption:</strong> Symmetric encryption for module transport and in-memory handling</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Multi-Tenant Architecture:</strong> Complete isolation between different owners and programs</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Debugger Detection:</strong> Continuous monitoring for debugging attempts with automatic account banning</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
        <p className="text-slate-300 mb-4">
          Choose your integration path based on your needs:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Client-Side Integration (C++ Library)</h4>
            <p className="text-sm text-slate-300 mb-3">
              Use the EchoAuth C++ library in your applications for user authentication and secure module downloads.
            </p>
            <Link
              href="/documentation/cpp-library/installation"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              View Installation Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Standalone Loader (C++ Loader)</h4>
            <p className="text-sm text-slate-300 mb-3">
              Deploy the ready-to-use EchoAuth loader for immediate cheat delivery and user management.
            </p>
            <Link
              href="/documentation/cpp-loader/configuration"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              View Configuration Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Backend Integration (API)</h4>
            <p className="text-sm text-slate-300 mb-3">
              Integrate EchoAuth API endpoints into your backend for user management and license distribution.
            </p>
            <Link
              href="/documentation/api-reference"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              View API Reference <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">System Requirements</h3>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Windows 10</strong> or later (for C++ library and loader)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Visual Studio 2017</strong> or later (for compilation)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>C++11</strong> or later standard</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Network connectivity</strong> for API communication</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">Security First</h3>
        <p className="text-slate-300 mb-4">
          EchoAuth is built with security as the foundation. Every response is signed with HMAC-SHA256,
          timestamps are validated to prevent replay attacks, and sensitive data is cleared from memory using
          Windows CryptoAPI's secure functions. However, EchoAuth is an authentication service, not an obfuscation service.
          You remain responsible for securing your overall application code.
        </p>

        <p className="text-slate-300 mb-6">
          <Link
            href="/documentation/security"
            className="text-cyan-400 hover:text-cyan-300 transition font-semibold"
          >
            Learn about our security practices →
          </Link>
        </p>
      </div>

      {/* Support Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-slate-700/50 rounded-lg p-6 mb-12">
        <h3 className="text-xl font-semibold text-white mb-2">Need Help?</h3>
        <p className="text-slate-300 mb-4">
          If you have questions or run into issues, check our troubleshooting guides or contact support.
        </p>
        <div className="flex gap-4">
          <Link
            href="/documentation/cpp-library/error-handling"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Error Handling Guide →
          </Link>
          <Link
            href="/documentation/cpp-loader/troubleshooting"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Loader Troubleshooting →
          </Link>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500">
        <p>EchoAuth Documentation v1.0 | Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
