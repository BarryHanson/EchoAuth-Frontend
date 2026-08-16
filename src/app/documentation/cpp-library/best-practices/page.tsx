'use client';

export default function BestPracticesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Best Practices</h1>
      <p className="text-xl text-slate-400 mb-12">
        Follow these best practices when using the EchoAuth C++ library.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">1. Security</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Never hardcode credentials</h4>
            <p className="text-sm text-slate-300 mb-2">
              Store API secrets, usernames, and passwords in configuration files, environment variables, or secure credential stores.
            </p>
            <p className="text-xs text-slate-400 italic">
              Bad: const char* secret = "secret_key_12345";
              <br/>
              Good: Load from environment: getenv("ECHOAUTH_SECRET")
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Always verify response signatures</h4>
            <p className="text-sm text-slate-300">
              The library does this automatically, but never disable signature verification.
              It's your only protection against tampering.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Use HWID locking</h4>
            <p className="text-sm text-slate-300">
              Always authenticate with HWID to lock sessions to specific machines.
              Pass the HWID obtained from GetCurrentHwProfile() to the login method.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Clear sensitive data</h4>
            <p className="text-sm text-slate-300">
              The library uses SecureZeroMemory() automatically. Don't store tokens or passwords in plain variables.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Use HTTPS in production</h4>
            <p className="text-sm text-slate-300">
              Always use SSL/TLS for API communication. Consider certificate pinning to prevent MITM attacks.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">2. Token Management</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Handle token expiration</h4>
            <p className="text-sm text-slate-300">
              Track the expires_in value from login responses. Re-authenticate before tokens expire.
              Implement token refresh logic for long-running applications.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Check for 401 responses</h4>
            <p className="text-sm text-slate-300">
              If you get a 401 Unauthorized, the token is invalid or expired. Re-authenticate immediately.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Store tokens securely</h4>
            <p className="text-sm text-slate-300">
              If you need to persist tokens between runs, use Windows Data Protection API (DPAPI) to encrypt them.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Clear tokens on logout</h4>
            <p className="text-sm text-slate-300">
              Call client.set_token("") when the user logs out to clear the token from memory.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">3. Error Handling</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Implement retry logic</h4>
            <p className="text-sm text-slate-300">
              Use exponential backoff for transient failures (NetworkException).
              Don't retry on authentication errors (401/403).
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Log all errors</h4>
            <p className="text-sm text-slate-300">
              Record exceptions, API errors, and security events for debugging and support.
              Include timestamps, error messages, and context.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Inform users clearly</h4>
            <p className="text-sm text-slate-300">
              Provide specific error messages so users know what happened and what to do next.
              "Connection failed" is worse than "Unable to reach authentication server. Check your internet connection."
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Don't expose internal errors</h4>
            <p className="text-sm text-slate-300">
              Don't show raw API error messages or stack traces to users.
              Log internal details but show user-friendly messages.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">4. Cheat Module Handling</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Never write to disk</h4>
            <p className="text-sm text-slate-300">
              Keep decrypted modules in memory only. Writing to disk leaves traces that can be detected.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Check cheat status</h4>
            <p className="text-sm text-slate-300">
              Always check download.cheat_status. If "Detected", inform the user and optionally ask for confirmation.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Validate file integrity</h4>
            <p className="text-sm text-slate-300">
              Check that decrypted files start with valid PE headers (MZ signature) before execution.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Clear after use</h4>
            <p className="text-sm text-slate-300">
              Use SecureZeroMemory() or Crypto methods to clear module data from memory after execution.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">5. Performance</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Reuse client instances</h4>
            <p className="text-sm text-slate-300">
              Create one EchoAuthClient and reuse it. Don't create new instances for each API call.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Cache credentials appropriately</h4>
            <p className="text-sm text-slate-300">
              Cache tokens for the duration of their validity. Don't re-authenticate on every request.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Respect rate limits</h4>
            <p className="text-sm text-slate-300">
              Implement request throttling. If you get a 429, wait 30 minutes - 1 hour before retrying.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Parallelize carefully</h4>
            <p className="text-sm text-slate-300">
              EchoAuthClient is thread-safe, but be careful with shared state. Use locks for critical sections.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">6. Compliance and Auditing</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Log authentication events</h4>
            <p className="text-sm text-slate-300">
              Record all login attempts, successes, and failures with timestamps for audit trails.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Monitor for suspicious activity</h4>
            <p className="text-sm text-slate-300">
              Track HWID mismatches, IP changes, and repeated auth failures. Alert admins to potential compromises.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Implement data retention policies</h4>
            <p className="text-sm text-slate-300">
              Don't retain tokens or credentials longer than necessary. Follow data protection regulations.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">7. Maintenance and Updates</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Update regularly</h4>
            <p className="text-sm text-slate-300">
              Keep the library updated with security patches and improvements.
              Distribute updates to users frequently.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Test before production</h4>
            <p className="text-sm text-slate-300">
              Test all error paths, edge cases, and unusual scenarios before releasing to users.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Monitor in production</h4>
            <p className="text-sm text-slate-300">
              Track error rates, authentication failures, and performance metrics in production.
              Alert on anomalies.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Checklist</h2>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Don't hardcode credentials</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Always use HWID locking</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Implement error handling and retry logic</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Check cheat status before execution</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Never write modules to disk</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Use HTTPS in production</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Log all errors and security events</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span>Keep the library and application updated</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
