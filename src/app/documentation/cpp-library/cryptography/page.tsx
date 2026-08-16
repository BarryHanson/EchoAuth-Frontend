'use client';

import { CodeBlock } from '@/components/CodeBlock';

export default function CryptographyPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Cryptography</h1>
      <p className="text-xl text-slate-400 mb-12">
        Learn about the cryptographic operations available in the EchoAuth library.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <p className="text-slate-300 mb-6">
          EchoAuth provides a comprehensive suite of cryptographic functions through the static Crypto class.
          All cryptographic operations use Windows CryptoAPI for maximum security and compatibility.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">XOR Encryption</h2>
        <p className="text-slate-300 mb-4">
          XOR encryption is used for symmetric encryption of cheat modules during transport and storage.
          Since XOR is symmetric, the same function both encrypts and decrypts.
        </p>

        <CodeBlock
          language="cpp"
          title="XOR Encryption/Decryption"
          code={`#include "echoauth/crypto.hpp"
#include <vector>
#include <string>

using namespace echoauth;

// Original data
std::vector<uint8_t> original_data = { 0x48, 0x65, 0x6C, 0x6C, 0x6F };
std::string xor_key = "secure_xor_key_12345";

// Encrypt
auto encrypted = Crypto::xor_encrypt(original_data, xor_key);
std::cout << "Encrypted " << encrypted.size() << " bytes" << std::endl;

// Decrypt (same operation)
auto decrypted = Crypto::xor_encrypt(encrypted, xor_key);
std::cout << "Decrypted matches original: " << (decrypted == original_data) << std::endl;`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">HMAC-SHA256 Signatures</h2>
        <p className="text-slate-300 mb-4">
          HMAC-SHA256 is used to sign and verify API responses, ensuring authenticity and integrity.
        </p>

        <CodeBlock
          language="cpp"
          title="HMAC-SHA256 Signing and Verification"
          code={`#include "echoauth/crypto.hpp"
#include <iostream>
#include <string>

using namespace echoauth;

std::string data = "Important message";
std::string secret_key = "secret_api_key_12345";

// Generate signature
std::string signature = Crypto::hmac_sha256(data, secret_key);
std::cout << "Signature: " << signature << std::endl;
std::cout << "Signature length: " << signature.length() << " characters" << std::endl;

// Verify signature (client libraries do this automatically)
std::string received_sig = signature;
bool valid = (Crypto::hmac_sha256(data, secret_key) == received_sig);
std::cout << "Signature valid: " << valid << std::endl;`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">SHA256 Hashing</h2>
        <p className="text-slate-300 mb-4">
          Direct SHA256 hashing without a key, useful for checksums and integrity verification.
        </p>

        <CodeBlock
          language="cpp"
          title="SHA256 Hashing"
          code={`#include "echoauth/crypto.hpp"
#include <iostream>
#include <string>

using namespace echoauth;

std::string data = "My data to hash";

// Generate hash
std::string hash = Crypto::sha256(data);
std::cout << "SHA256: " << hash << std::endl;

// Hashes are deterministic - same input = same output
std::string hash2 = Crypto::sha256(data);
std::cout << "Hashes match: " << (hash == hash2) << std::endl;`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Secure Random Bytes</h2>
        <p className="text-slate-300 mb-4">
          Generate cryptographically secure random bytes using Windows CryptGenRandom.
        </p>

        <CodeBlock
          language="cpp"
          title="Random Byte Generation"
          code={`#include "echoauth/crypto.hpp"
#include <iostream>
#include <iomanip>

using namespace echoauth;

// Generate 16 random bytes
auto random = Crypto::random_bytes(16);

std::cout << "Random bytes: ";
for (uint8_t byte : random) {
    std::cout << std::hex << std::setw(2) << std::setfill('0')
              << (int)byte << " ";
}
std::cout << std::endl;

// Use for nonces, tokens, or key material
std::vector<uint8_t> nonce = Crypto::random_bytes(32);
std::cout << "Generated 32-byte nonce" << std::endl;`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Base64 Encoding</h2>
        <p className="text-slate-300 mb-4">
          Encode binary data to base64 for transmission in JSON and text-based formats.
        </p>

        <CodeBlock
          language="cpp"
          title="Base64 Encoding and Decoding"
          code={`#include "echoauth/crypto.hpp"
#include <iostream>
#include <vector>
#include <string>

using namespace echoauth;

// Encode binary data to base64
std::vector<uint8_t> binary_data = { 0x48, 0x65, 0x6C, 0x6C, 0x6F };
std::string encoded = Crypto::base64_encode(binary_data);
std::cout << "Encoded: " << encoded << std::endl;

// Decode base64 back to binary
std::vector<uint8_t> decoded = Crypto::base64_decode(encoded);
std::cout << "Decoded " << decoded.size() << " bytes" << std::endl;
std::cout << "Round-trip successful: " << (decoded == binary_data) << std::endl;`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Cryptography Best Practices</h2>
        <div className="space-y-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Always Verify Signatures</h4>
            <p className="text-sm text-slate-300">
              The library automatically verifies response signatures, but if you're implementing your own verification, always use constant-time comparison.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Use HMAC for Authentication</h4>
            <p className="text-sm text-slate-300">
              Always use HMAC-SHA256 for authentication, never plain SHA256. HMAC includes a secret key that prevents forgery.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Clear Sensitive Data</h4>
            <p className="text-sm text-slate-300">
              The library automatically clears encryption keys and credentials from memory using SecureZeroMemory().
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Don't Hardcode Keys</h4>
            <p className="text-sm text-slate-300">
              Store API secrets in configuration files or environment variables, never in source code.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">✓ Use Secure Randomness</h4>
            <p className="text-sm text-slate-300">
              Always use Crypto::random_bytes() for cryptographic purposes, never rand() or other weak PRNGs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
