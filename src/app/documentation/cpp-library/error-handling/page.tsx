'use client';

import { CodeBlock } from '@/components/CodeBlock';

export default function ErrorHandlingPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Error Handling</h1>
      <p className="text-xl text-slate-400 mb-12">
        Properly handle and recover from errors in the EchoAuth library.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Exception Hierarchy</h2>
        <p className="text-slate-300 mb-4">
          The library provides a hierarchy of custom exceptions to help you handle different error types:
        </p>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <p className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
{`Exception (base)
├── NetworkException
├── AuthenticationException
├── CryptoException
├── SecurityException
├── MemoryException
└── ValidationException`}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Catching Exceptions</h2>
        <CodeBlock
          language="cpp"
          title="Catching specific exceptions"
          code={`#include "echoauth/client.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        auto login = client.login("user", "pass");
        // ... more code ...
    }
    catch (const NetworkException& e) {
        // Handle network errors
        std::cout << "Network error: " << e.what() << std::endl;
        std::cout << "Check your internet connection" << std::endl;
        std::cout << "Consider implementing retry logic" << std::endl;
    }
    catch (const AuthenticationException& e) {
        // Handle auth errors
        std::cout << "Authentication failed: " << e.what() << std::endl;
        std::cout << "Invalid credentials or expired token" << std::endl;
    }
    catch (const CryptoException& e) {
        // Handle crypto errors
        std::cout << "Crypto error: " << e.what() << std::endl;
    }
    catch (const SecurityException& e) {
        // Handle security violations
        std::cout << "Security error: " << e.what() << std::endl;
        std::cout << "Your account may have been compromised" << std::endl;
    }
    catch (const Exception& e) {
        // Catch all EchoAuth exceptions
        std::cout << "EchoAuth error: " << e.what() << std::endl;
    }
    catch (const std::exception& e) {
        // Catch any standard exception
        std::cout << "Unexpected error: " << e.what() << std::endl;
    }

    return 0;
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">API Response Errors</h2>
        <p className="text-slate-300 mb-4">
          When API calls return errors, check the response success flag and message:
        </p>

        <CodeBlock
          language="cpp"
          title="Handling API response errors"
          code={`#include "echoauth/client.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        // Login attempt
        auto login = client.login("user", "pass");

        if (!login.success) {
            // API returned an error
            std::cout << "API Error: " << login.message << std::endl;

            // Check error type by message content
            if (login.message.find("Invalid credentials") != std::string::npos) {
                std::cout << "Wrong username or password" << std::endl;
                std::cout << "Please try again with correct credentials" << std::endl;
            } else if (login.message.find("rate limit") != std::string::npos) {
                std::cout << "Too many login attempts" << std::endl;
                std::cout << "Please wait a few minutes and try again" << std::endl;
            } else if (login.message.find("HWID") != std::string::npos) {
                std::cout << "HWID mismatch" << std::endl;
                std::cout << "This account is locked to a different machine" << std::endl;
            }

            return 1;
        }

        // Success
        std::cout << "Login successful" << std::endl;
        return 0;
    }
    catch (const std::exception& e) {
        std::cout << "Exception: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Retry Logic</h2>
        <p className="text-slate-300 mb-4">
          Implement exponential backoff for transient failures:
        </p>

        <CodeBlock
          language="cpp"
          title="Retry with exponential backoff"
          code={`#include "echoauth/client.hpp"
#include <iostream>
#include <thread>
#include <chrono>

using namespace echoauth;

LoginResponse login_with_retry(
    EchoAuthClient& client,
    const std::string& username,
    const std::string& password,
    int max_retries = 3
) {
    for (int attempt = 1; attempt <= max_retries; attempt++) {
        try {
            return client.login(username, password);
        }
        catch (const NetworkException& e) {
            if (attempt < max_retries) {
                // Exponential backoff: 1s, 2s, 4s
                int backoff_ms = 1000 * (1 << (attempt - 1));
                std::cout << "Network error on attempt " << attempt
                          << ", retrying in " << backoff_ms << "ms..." << std::endl;
                std::this_thread::sleep_for(std::chrono::milliseconds(backoff_ms));
            } else {
                // Max retries reached
                throw;
            }
        }
        catch (const AuthenticationException& e) {
            // Don't retry auth errors
            throw;
        }
    }

    // Should not reach here
    throw NetworkException("Max retries exceeded");
}

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        auto login = login_with_retry(client, "user", "pass");

        if (login.success) {
            std::cout << "Login successful after retry" << std::endl;
        }
    }
    catch (const std::exception& e) {
        std::cout << "Failed: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Common Errors and Solutions</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Invalid credentials</h4>
            <p className="text-sm text-slate-300">
              <strong>Cause:</strong> Wrong username or password
              <br />
              <strong>Solution:</strong> Verify credentials and try again. Don't retry automatically.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">HWID does not match</h4>
            <p className="text-sm text-slate-300">
              <strong>Cause:</strong> Account is locked to a different machine
              <br />
              <strong>Solution:</strong> User must use the account from the original machine or reset HWID from settings.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Connection timeout</h4>
            <p className="text-sm text-slate-300">
              <strong>Cause:</strong> Network issue or server unreachable
              <br />
              <strong>Solution:</strong> Implement retry logic with exponential backoff. Check internet connection.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Rate limit exceeded</h4>
            <p className="text-sm text-slate-300">
              <strong>Cause:</strong> Too many requests in short time
              <br />
              <strong>Solution:</strong> Wait 30 minutes - 1 hour before retrying. Implement request throttling.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Suspicious activity detected</h4>
            <p className="text-sm text-slate-300">
              <strong>Cause:</strong> System clock tampering or security violation detected
              <br />
              <strong>Solution:</strong> Account may be banned. Contact support. Don't retry automatically.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Error Handling Best Practices</h2>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Catch specific exceptions:</strong> Handle different error types differently</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Log errors:</strong> Record all errors for debugging and support</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Inform users:</strong> Provide clear error messages to guide them</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Retry transient failures:</strong> Network errors merit retry logic</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Don't retry auth errors:</strong> Invalid credentials won't succeed on retry</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Implement exponential backoff:</strong> Avoid overwhelming the server</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
