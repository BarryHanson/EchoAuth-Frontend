'use client';

import { CodeBlock } from '@/components/CodeBlock';

export default function DownloadingCheatsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Downloading Cheats</h1>
      <p className="text-xl text-slate-400 mb-12">
        Learn how to securely download and handle encrypted cheat modules.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <p className="text-slate-300 mb-6">
          Cheat modules are downloaded as XOR-encrypted binaries, never touching disk in plaintext.
          This provides zero-disk footprint execution and prevents simple binary analysis.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">The Download Process</h2>
        <ol className="space-y-4 mb-6 text-slate-300">
          <li className="flex items-start gap-3">
            <span className="font-bold text-cyan-400 flex-shrink-0">1.</span>
            <span>Authenticate with JWT token (done via login)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-cyan-400 flex-shrink-0">2.</span>
            <span>Call download_cheat() with cheat ID and XOR key</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-cyan-400 flex-shrink-0">3.</span>
            <span>Receive base64-encoded XOR-encrypted binary</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-cyan-400 flex-shrink-0">4.</span>
            <span>Decode from base64</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-cyan-400 flex-shrink-0">5.</span>
            <span>XOR-decrypt using the same XOR key</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-cyan-400 flex-shrink-0">6.</span>
            <span>Execute the decrypted binary in memory</span>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-white mb-4">Basic Download</h2>
        <CodeBlock
          language="cpp"
          title="Download a cheat module"
          code={`#include "echoauth/client.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        // First, authenticate
        auto login = client.login("user", "pass");
        if (!login.success) {
            std::cout << "Login failed" << std::endl;
            return 1;
        }

        // Download cheat
        int cheat_id = 2;
        std::string xor_key = "secure_xor_key_12345";

        auto download = client.download_cheat(cheat_id, xor_key);

        if (download.success) {
            std::cout << "Download successful!" << std::endl;
            std::cout << "Filename: " << download.filename << std::endl;
            std::cout << "File size: " << download.file_data.size() << " bytes" << std::endl;
            std::cout << "Status: " << download.cheat_status << std::endl;
        } else {
            std::cout << "Download failed: " << download.message << std::endl;
        }

        return 0;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Decryption and Execution</h2>
        <CodeBlock
          language="cpp"
          title="Decrypt and execute"
          code={`#include "echoauth/client.hpp"
#include "echoauth/crypto.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        // Login and download
        auto login = client.login("user", "pass");
        auto download = client.download_cheat(2, "secure_xor_key_12345");

        if (download.success) {
            // The file_data is XOR-encrypted
            std::vector<uint8_t> encrypted_data = download.file_data;

            // Decrypt using the same XOR key
            auto decrypted_data = Crypto::xor_encrypt(
                encrypted_data,
                "secure_xor_key_12345"
            );

            std::cout << "Decrypted " << decrypted_data.size() << " bytes" << std::endl;

            // Now you can execute the decrypted binary
            // (This is typically done in the loader application)
        }

        return 0;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Handling Cheat Status</h2>
        <p className="text-slate-300 mb-4">
          The download response includes the cheat's status (Detected or Undetected).
          Use this to inform users about potential risks.
        </p>

        <CodeBlock
          language="cpp"
          title="Check cheat status"
          code={`#include "echoauth/client.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        auto login = client.login("user", "pass");
        auto download = client.download_cheat(2, "secure_xor_key_12345");

        if (download.success) {
            // Check cheat status
            if (download.cheat_status == "Detected") {
                std::cout << "Warning: This cheat is marked as DETECTED" << std::endl;
                std::cout << "Use at your own risk" << std::endl;

                // Optionally prompt user
                std::cout << "Continue? (y/n): ";
                char response;
                std::cin >> response;

                if (response != 'y' && response != 'Y') {
                    std::cout << "Download cancelled" << std::endl;
                    return 0;
                }
            } else if (download.cheat_status == "Undetected") {
                std::cout << "Cheat status: UNDETECTED" << std::endl;
            }

            // Proceed with execution
        }

        return 0;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Error Handling</h2>
        <CodeBlock
          language="cpp"
          title="Comprehensive error handling for downloads"
          code={`#include "echoauth/client.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        auto login = client.login("user", "pass");
        if (!login.success) {
            std::cout << "Login failed: " << login.message << std::endl;
            return 1;
        }

        auto download = client.download_cheat(2, "secure_xor_key_12345");

        if (!download.success) {
            // Handle download errors
            std::string error = download.message;

            if (error.find("not found") != std::string::npos) {
                std::cout << "Cheat not found" << std::endl;
            } else if (error.find("permission") != std::string::npos) {
                std::cout << "You don't have access to this cheat" << std::endl;
            } else if (error.find("rate limit") != std::string::npos) {
                std::cout << "Rate limit exceeded, try again later" << std::endl;
            } else {
                std::cout << "Download failed: " << error << std::endl;
            }

            return 1;
        }

        std::cout << "Download successful" << std::endl;
        return 0;
    }
    catch (const NetworkException& e) {
        std::cout << "Network error: " << e.what() << std::endl;
        std::cout << "Check your internet connection" << std::endl;
        return 1;
    }
    catch (const CryptoException& e) {
        std::cout << "Crypto error: " << e.what() << std::endl;
        return 1;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Validate Cheat Status</h4>
            <p className="text-sm text-slate-300">
              Always check download.cheat_status before execution and inform the user if it's marked as detected.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Never Write to Disk</h4>
            <p className="text-sm text-slate-300">
              Keep decrypted data in memory only. Never write plaintext modules to disk to avoid detection.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Clear Memory After Use</h4>
            <p className="text-sm text-slate-300">
              Use Crypto::xor_encrypt or SecureZeroMemory to clear sensitive data after use.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Implement Retry Logic</h4>
            <p className="text-sm text-slate-300">
              Handle transient failures with exponential backoff, but don't retry on 401/403 errors.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Monitor File Size</h4>
            <p className="text-sm text-slate-300">
              Validate that downloaded files are within expected size ranges to detect corruption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
