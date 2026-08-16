'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ApiReferencePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
      <p className="text-xl text-slate-400 mb-12">
        Complete reference for all EchoAuth API endpoints.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <p className="text-slate-300 mb-6">
          The EchoAuth API is organized into logical groups of endpoints. All endpoints use JSON for request and response data.
        </p>

        <h3 className="text-xl font-semibold text-white mb-3">Base URL</h3>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <p className="font-mono text-cyan-400">http://localhost:3001/api</p>
          <p className="text-sm text-slate-400 mt-2">In production, use your deployed API URL</p>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">Authentication</h3>
        <p className="text-slate-300 mb-4">
          There are two ways to authenticate with the EchoAuth API:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">JWT Bearer Token</h4>
            <p className="text-sm text-slate-300 mb-2">
              Obtained after login, include in Authorization header:
            </p>
            <p className="font-mono text-sm bg-slate-900 p-2 rounded text-slate-300">
              Authorization: Bearer &lt;token&gt;
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Key + HWID (Client Authentication)</h4>
            <p className="text-sm text-slate-300">
              For client applications, use license key + machine HWID
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">Response Format</h3>
        <p className="text-slate-300 mb-4">
          All responses are JSON with the following structure:
        </p>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <p className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
{`{
  "success": true|false,
  "message": "Status or error message",
  "data": { ... },
  "timestamp": 1234567890
}`}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">Rate Limiting</h3>
        <p className="text-slate-300 mb-4">
          The API enforces rate limits to ensure fair usage:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Authentication:</strong> 10 requests per 15 minutes per IP</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Key Generation:</strong> 50 keys per hour per user</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>File Download:</strong> 100 downloads per hour per user</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>General API:</strong> 200 requests per minute per user</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Endpoint Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/documentation/api-reference/authentication"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Authentication</h3>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400">
              User registration and login endpoints
            </p>
            <div className="text-xs text-slate-500 mt-3 space-y-1">
              <p>POST /auth/register</p>
              <p>POST /auth/login</p>
              <p>GET /auth/me</p>
            </div>
          </Link>

          <Link
            href="/documentation/api-reference/client"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Client Endpoints</h3>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400">
              Client app integration endpoints
            </p>
            <div className="text-xs text-slate-500 mt-3 space-y-1">
              <p>POST /client/auth</p>
              <p>POST /client/download</p>
              <p>POST /client/loader/check-version</p>
            </div>
          </Link>

          <Link
            href="/documentation/api-reference/admin"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Admin Endpoints</h3>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400">
              Program and license management
            </p>
            <div className="text-xs text-slate-500 mt-3 space-y-1">
              <p>POST /admin/keys/generate</p>
              <p>POST /admin/cheats</p>
              <p>PUT /admin/cheats/:id/status</p>
            </div>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Common Response Codes</h2>
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-4 p-3 bg-slate-800 border border-slate-700 rounded">
            <span className="font-mono text-green-400 font-semibold whitespace-nowrap">200</span>
            <div>
              <p className="font-semibold text-white">Success</p>
              <p className="text-sm text-slate-400">Request succeeded, response contains result</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-slate-800 border border-slate-700 rounded">
            <span className="font-mono text-yellow-400 font-semibold whitespace-nowrap">400</span>
            <div>
              <p className="font-semibold text-white">Bad Request</p>
              <p className="text-sm text-slate-400">Invalid request parameters or format</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-slate-800 border border-slate-700 rounded">
            <span className="font-mono text-red-400 font-semibold whitespace-nowrap">401</span>
            <div>
              <p className="font-semibold text-white">Unauthorized</p>
              <p className="text-sm text-slate-400">Authentication failed or missing credentials</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-slate-800 border border-slate-700 rounded">
            <span className="font-mono text-red-400 font-semibold whitespace-nowrap">403</span>
            <div>
              <p className="font-semibold text-white">Forbidden</p>
              <p className="text-sm text-slate-400">Insufficient permissions for this resource</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-slate-800 border border-slate-700 rounded">
            <span className="font-mono text-red-400 font-semibold whitespace-nowrap">429</span>
            <div>
              <p className="font-semibold text-white">Too Many Requests</p>
              <p className="text-sm text-slate-400">Rate limit exceeded, try again later</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-slate-800 border border-slate-700 rounded">
            <span className="font-mono text-red-400 font-semibold whitespace-nowrap">500</span>
            <div>
              <p className="font-semibold text-white">Server Error</p>
              <p className="text-sm text-slate-400">Internal server error, contact support</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Error Handling</h2>
        <p className="text-slate-300 mb-4">
          When an error occurs, the API returns an error response:
        </p>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <p className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
{`{
  "success": false,
  "message": "Invalid credentials",
  "timestamp": 1234567890
}`}
          </p>
        </div>

        <p className="text-slate-300 mb-6">
          Always check the <code className="bg-slate-800 px-2 py-1 rounded text-sm">success</code> field in responses before processing data.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">HMAC-SHA256 Response Signatures</h2>
        <p className="text-slate-300 mb-4">
          All API responses are signed with HMAC-SHA256 to prevent tampering. The signature is included in the response headers.
          Client libraries automatically verify this signature.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">Next Steps</h2>
        <p className="text-slate-300 mb-4">
          Explore the detailed endpoint documentation:
        </p>
        <ul className="space-y-2 text-slate-300">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">→</span>
            <span><a href="/documentation/api-reference/authentication" className="text-cyan-400 hover:text-cyan-300 transition">Authentication Endpoints</a></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">→</span>
            <span><a href="/documentation/api-reference/client" className="text-cyan-400 hover:text-cyan-300 transition">Client Endpoints</a></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">→</span>
            <span><a href="/documentation/api-reference/admin" className="text-cyan-400 hover:text-cyan-300 transition">Admin Endpoints</a></span>
          </li>
        </ul>
      </div>
    </div>
  );
}
