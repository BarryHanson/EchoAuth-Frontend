'use client';

export default function SecurityPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Security Practices</h1>
      <p className="text-xl text-slate-400 mb-12">
        Comprehensive guide to EchoAuth's security features and best practices for secure implementation.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Important Note</h2>
        <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6">
          <p className="text-red-300 font-semibold mb-2">⚠️ EchoAuth is an Authentication Service</p>
          <p className="text-sm text-red-200">
            EchoAuth provides secure authentication and session management. However, EchoAuth is <strong>NOT</strong> an obfuscation service.
            You remain responsible for securing your overall application code, protecting against reverse engineering, and implementing
            additional anti-tampering measures if needed.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">EchoAuth Security Features</h2>

        <h3 className="text-xl font-semibold text-white mb-3">1. JWT Authentication</h3>
        <p className="text-slate-300 mb-4">
          EchoAuth uses JSON Web Tokens (JWT) for secure, stateless authentication. Tokens:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Are cryptographically signed to prevent tampering</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Include expiration time (24 hours by default)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Can be verified without contacting the server</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Are cleared from memory on logout using SecureZeroMemory()</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">2. HMAC-SHA256 Response Signatures</h3>
        <p className="text-slate-300 mb-4">
          Every API response is signed with HMAC-SHA256 using the server's API secret. This ensures:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Response authenticity - responses came from the real server</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Response integrity - responses were not modified in transit</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Prevents man-in-the-middle attacks</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Client libraries verify signatures using constant-time comparison</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">3. HWID (Hardware ID) Locking</h3>
        <p className="text-slate-300 mb-4">
          Sessions can be locked to specific machine hardware, preventing:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Account sharing across multiple machines</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Unauthorized access from different computers</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Can be toggled per cheat/program for flexibility</span>
          </li>
        </ul>

        <p className="text-slate-300 mb-6">
          HWID is obtained from Windows hardware profiles using <code className="bg-slate-800 px-2 py-1 rounded text-sm">GetCurrentHwProfile()</code>,
          which provides a unique identifier tied to the machine's hardware configuration.
        </p>

        <h3 className="text-xl font-semibold text-white mb-3">4. IP Locking</h3>
        <p className="text-slate-300 mb-4">
          Optional per-session IP address binding allows restricting access to specific networks or detecting suspicious logins from new locations.
          Can be enabled/disabled independently per cheat.
        </p>

        <h3 className="text-xl font-semibold text-white mb-3">5. Timestamp Drift Detection</h3>
        <p className="text-slate-300 mb-4">
          EchoAuth detects system clock tampering by monitoring timestamp changes:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Stores server timestamp at each authentication</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Detects if client's system clock moves backward more than 5 minutes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Invalidates session and flags as suspicious if tampering detected</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Prevents trial period extension via clock manipulation</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">6. XOR Encryption for Modules</h3>
        <p className="text-slate-300 mb-4">
          Downloaded cheat modules are XOR-encrypted for transport and in-memory handling:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Modules never touch disk in plaintext</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Symmetric cipher allows decryption with same key</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Prevents simple binary analysis during download</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Uses Windows CryptoAPI for key derivation</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">7. Debugger Detection</h3>
        <p className="text-slate-300 mb-4">
          The C++ loader includes continuous debugger detection:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Monitors every 100ms using Windows API</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Automatically bans user if debugger detected post-authentication</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Logs critical security violations to server</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">8. Secure Memory Handling</h3>
        <p className="text-slate-300 mb-4">
          All sensitive data is protected in memory:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Uses Windows <code className="bg-slate-800 px-2 py-1 rounded text-sm">SecureZeroMemory()</code> to prevent recovery</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Clears tokens, passwords, and API secrets on exit</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Memory is overwritten multiple times before deallocation</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">9. Windows CryptoAPI Integration</h3>
        <p className="text-slate-300 mb-4">
          Leverages OS-level cryptography:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Uses CryptoAPI for HMAC-SHA256 and SHA256</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>CryptGenRandom for cryptographically secure random bytes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Benefits from Windows security updates</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Developer Responsibilities</h2>
        <p className="text-slate-300 mb-4">
          While EchoAuth provides robust security infrastructure, you must also:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Always Verify Response Signatures</h4>
            <p className="text-sm text-slate-300">
              Our client libraries do this automatically, but if implementing your own, always verify HMAC-SHA256 signatures.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Never Hardcode Credentials</h4>
            <p className="text-sm text-slate-300">
              Read usernames, passwords, and API secrets from environment variables or secure configuration files.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Use HTTPS in Production</h4>
            <p className="text-sm text-slate-300">
              Always use SSL/TLS for API communication. Consider certificate pinning to prevent MITM attacks.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Handle Token Expiration</h4>
            <p className="text-sm text-slate-300">
              Implement proper token refresh logic. Re-authenticate before tokens expire.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Implement Retry Logic</h4>
            <p className="text-sm text-slate-300">
              Handle transient network failures with exponential backoff. Don't retry on authentication errors.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Respect Rate Limits</h4>
            <p className="text-sm text-slate-300">
              Implement backoff when rate limited. Don't retry immediately on 429 responses.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Validate Input</h4>
            <p className="text-sm text-slate-300">
              Validate all user input before sending to API. Sanitize data from external sources.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Log Security Events</h4>
            <p className="text-sm text-slate-300">
              Log authentication attempts, failures, and security-related events for audit trails.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Obfuscate Your Code</h4>
            <p className="text-sm text-slate-300">
              Use code obfuscation, control flow flattening, or virtualization to protect your application logic.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Update Regularly</h4>
            <p className="text-sm text-slate-300">
              Distribute updates frequently. The longer your code stays unchanged, the more time attackers have to analyze it.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">What EchoAuth Does NOT Provide</h2>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold">✗</span>
            <span><strong>Code Obfuscation:</strong> You must obfuscate your application code</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold">✗</span>
            <span><strong>Anti-Debugging:</strong> Implement your own anti-debug measures if needed</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold">✗</span>
            <span><strong>VM Detection:</strong> This is up to the cheat developer</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold">✗</span>
            <span><strong>General Application Protection:</strong> Only authentication and session management</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Security Best Practices Summary</h2>
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-slate-700/50 rounded-lg p-6">
          <ol className="space-y-2 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">1.</span>
              <span>Use HWID locking on all user sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">2.</span>
              <span>Always verify response signatures</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">3.</span>
              <span>Implement proper token management</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">4.</span>
              <span>Monitor suspicious activity patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">5.</span>
              <span>Use HTTPS/TLS in production</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">6.</span>
              <span>Implement code obfuscation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">7.</span>
              <span>Update your application regularly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-cyan-400">8.</span>
              <span>Log and audit security events</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
