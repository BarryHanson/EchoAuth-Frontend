'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';

export default function CppLibraryPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">C++ Library</h1>
      <p className="text-xl text-slate-400 mb-12">
        The EchoAuth C++ Library provides a complete client for authentication, secure communication, and cheat module management.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <p className="text-slate-300 mb-6">
          The EchoAuth C++ Library is a static library built for Windows that handles all communication with the EchoAuth authentication service.
          It provides secure authentication, response signature verification, and encrypted module delivery with zero-disk footprint.
        </p>

        <h3 className="text-xl font-semibold text-white mb-3">Architecture</h3>
        <p className="text-slate-300 mb-4">
          The library is organized into four main components:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">EchoAuthClient</h4>
            <p className="text-sm text-slate-300">
              The main client class for authentication and API communication. Handles login, token management, and all API requests.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Crypto</h4>
            <p className="text-sm text-slate-300">
              Static utility class for cryptographic operations: XOR encryption, HMAC-SHA256 signing, base64 encoding, and secure random generation.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Response Structures</h4>
            <p className="text-sm text-slate-300">
              Data classes for API responses: LoginResponse, CheatFileDownloadResponse, UserInfoResponse, KeyInfoResponse.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Exception Hierarchy</h4>
            <p className="text-sm text-slate-300">
              Custom exceptions for different error types: NetworkException, AuthenticationException, CryptoException, SecurityException.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>JWT Authentication:</strong> Secure token-based login with automatic expiration handling</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>HMAC-SHA256 Signatures:</strong> Verify response authenticity to prevent man-in-the-middle attacks</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>XOR Encryption:</strong> Symmetric encryption for module transport and in-memory handling</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>HWID Locking:</strong> Session binding to specific machine hardware</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Secure Memory Handling:</strong> Automatic cleanup of sensitive data using SecureZeroMemory()</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Windows CryptoAPI:</strong> Leverages OS cryptographic primitives for maximum security</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">Public API Methods</h3>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <h4 className="font-mono text-sm font-semibold text-cyan-400 mb-3">EchoAuthClient Methods</h4>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <p className="font-mono text-cyan-400">LoginResponse login(username, password)</p>
              <p className="text-slate-400">Authenticate with username and password</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">LoginResponse login(username, password, hwid)</p>
              <p className="text-slate-400">Authenticate with HWID session locking</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">CheatFileDownloadResponse download_cheat(cheatId, xorKey)</p>
              <p className="text-slate-400">Download XOR-encrypted cheat module</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">UserInfoResponse get_user_info()</p>
              <p className="text-slate-400">Fetch authenticated user details</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">bool verify_response_signature(data, signature)</p>
              <p className="text-slate-400">Verify HMAC-SHA256 response signature</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">void set_token(token) / std::string get_token()</p>
              <p className="text-slate-400">Manage JWT bearer token</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <h4 className="font-mono text-sm font-semibold text-cyan-400 mb-3">Crypto Static Methods</h4>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <p className="font-mono text-cyan-400">vector&lt;uint8_t&gt; xor_encrypt(data, key)</p>
              <p className="text-slate-400">XOR encryption/decryption (symmetric)</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">string hmac_sha256(data, key)</p>
              <p className="text-slate-400">Generate HMAC-SHA256 signature</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">string sha256(data)</p>
              <p className="text-slate-400">Generate SHA256 hash</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">vector&lt;uint8_t&gt; random_bytes(length)</p>
              <p className="text-slate-400">Cryptographically secure random bytes</p>
            </div>
            <div>
              <p className="font-mono text-cyan-400">string base64_encode(data)</p>
              <p className="text-slate-400">Encode binary data to base64</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">Basic Usage Example</h3>
        <CodeBlock
          language="cpp"
          title="Simple login and download"
          code={`#include "echoauth/client.hpp"
#include <iostream>

using namespace echoauth;

int main() {
    try {
        // Create client
        EchoAuthClient client(
            "http://localhost:3001",
            "secret_f2eea919eaff5005a13ea7bc9ec631d96a768d26822582477e31e61f76ce77be",
            true  // verify SSL
        );

        // Login with username and password
        auto login_resp = client.login("testuser", "password123");

        if (login_resp.success) {
            std::cout << "Login successful! Token: " << login_resp.token.substr(0, 20) << "..." << std::endl;

            // Token is automatically stored internally

            // Download encrypted cheat
            auto download = client.download_cheat(2, "secure_xor_key_12345");

            if (download.success) {
                std::cout << "Downloaded cheat file: " << download.filename << std::endl;
                std::cout << "File size: " << download.file_data.size() << " bytes" << std::endl;

                // Decrypt in-memory
                auto decrypted = Crypto::xor_encrypt(
                    download.file_data,
                    "secure_xor_key_12345"
                );

                // Now you can execute the decrypted binary...
            } else {
                std::cout << "Download failed: " << download.message << std::endl;
            }
        } else {
            std::cout << "Login failed: " << login_resp.message << std::endl;
        }
    }
    catch (const AuthenticationException& e) {
        std::cout << "Auth error: " << e.what() << std::endl;
    }
    catch (const NetworkException& e) {
        std::cout << "Network error: " << e.what() << std::endl;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }

    return 0;
}`}
        />

        <h3 className="text-xl font-semibold text-white mb-3">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/documentation/cpp-library/installation"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Installation & Build</h4>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400 mt-2">Set up the library in your Visual Studio project</p>
          </Link>

          <Link
            href="/documentation/cpp-library/authentication"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Authentication</h4>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400 mt-2">Learn about login, HWID locking, and token management</p>
          </Link>

          <Link
            href="/documentation/cpp-library/cryptography"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Cryptography</h4>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400 mt-2">Understand encryption, signatures, and secure operations</p>
          </Link>

          <Link
            href="/documentation/cpp-library/downloading-cheats"
            className="group p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-600/50 transition"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Downloading Cheats</h4>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
            <p className="text-sm text-slate-400 mt-2">Download and handle encrypted modules</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
