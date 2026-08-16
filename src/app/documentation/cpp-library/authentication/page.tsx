'use client';

import { CodeBlock } from '@/components/CodeBlock';

export default function AuthenticationPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Authentication</h1>
      <p className="text-xl text-slate-400 mb-12">
        Learn how to authenticate users and manage sessions with the EchoAuth library.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Creating the Client</h2>
        <p className="text-slate-300 mb-4">
          First, create an EchoAuthClient instance with your API configuration:
        </p>
        <CodeBlock
          language="cpp"
          title="Creating the client"
          code={`#include "echoauth/client.hpp"

using namespace echoauth;

// Create client with API URL and secret
EchoAuthClient client(
    "http://localhost:3001",                          // API URL
    "secret_f2eea919eaff5005a13ea7bc9ec631d96a...",  // API Secret
    true                                               // Verify SSL (recommended)
);`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Basic Login</h2>
        <p className="text-slate-300 mb-4">
          Authenticate with username and password:
        </p>
        <CodeBlock
          language="cpp"
          title="Simple login"
          code={`try {
    auto login_response = client.login("username", "password");

    if (login_response.success) {
        std::cout << "Login successful!" << std::endl;
        std::cout << "Token: " << login_response.token << std::endl;
        std::cout << "Expires in: " << login_response.expires_in << " seconds" << std::endl;

        // Token is automatically stored in the client
    } else {
        std::cout << "Login failed: " << login_response.message << std::endl;
    }
}
catch (const AuthenticationException& e) {
    std::cout << "Authentication error: " << e.what() << std::endl;
}
catch (const NetworkException& e) {
    std::cout << "Network error: " << e.what() << std::endl;
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">HWID Locking</h2>
        <p className="text-slate-300 mb-4">
          HWID (Hardware ID) locking binds a user's session to a specific machine. This prevents account sharing across different computers.
          When a user logs in with HWID locking, they can only use their account from that specific machine.
        </p>

        <p className="text-slate-300 mb-4">
          To get the machine's HWID on Windows:
        </p>
        <CodeBlock
          language="cpp"
          title="Getting machine HWID"
          code={`#include <windows.h>
#include <string>
#include <algorithm>

std::string get_hwid() {
    HW_PROFILE_INFO hw_profile;
    if (GetCurrentHwProfile(&hw_profile)) {
        // Convert wide char to regular char
        std::string hwid;
        for (int i = 0; hw_profile.szHwProfileGuid[i] != 0; i++) {
            hwid += (char)hw_profile.szHwProfileGuid[i];
        }

        // Remove curly braces
        hwid.erase(std::remove(hwid.begin(), hwid.end(), '{'), hwid.end());
        hwid.erase(std::remove(hwid.begin(), hwid.end(), '}'), hwid.end());

        return hwid;
    }
    return "";
}`}
        />

        <p className="text-slate-300 mb-4">
          Now authenticate with HWID:
        </p>
        <CodeBlock
          language="cpp"
          title="Login with HWID locking"
          code={`std::string hwid = get_hwid();

auto login_response = client.login("username", "password", hwid);

if (login_response.success) {
    std::cout << "Login successful with HWID: " << hwid << std::endl;
    std::cout << "This session is now locked to this machine" << std::endl;

    // If user tries to login from a different machine with this account,
    // it will fail with "HWID does not match" error
} else {
    std::cout << "Login failed: " << login_response.message << std::endl;
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Token Management</h2>
        <p className="text-slate-300 mb-4">
          After successful login, the JWT token is automatically stored in the client. Use the token for subsequent API calls.
        </p>

        <h3 className="text-lg font-semibold text-white mb-3">Retrieving the Token</h3>
        <CodeBlock
          language="cpp"
          title="Get current token"
          code={`std::string token = client.get_token();

if (!token.empty()) {
    std::cout << "Current token: " << token.substr(0, 20) << "..." << std::endl;
} else {
    std::cout << "Not authenticated" << std::endl;
}`}
        />

        <h3 className="text-lg font-semibold text-white mb-3">Setting a Token Manually</h3>
        <CodeBlock
          language="cpp"
          title="Set token for subsequent requests"
          code={`// If you already have a token from storage or previous session
client.set_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");

// Now all API calls will use this token automatically
auto user_info = client.get_user_info();`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Getting User Information</h2>
        <p className="text-slate-300 mb-4">
          After authentication, retrieve the authenticated user's information:
        </p>
        <CodeBlock
          language="cpp"
          title="Get user info"
          code={`try {
    auto user_info = client.get_user_info();

    if (user_info.success) {
        std::cout << "User ID: " << user_info.user_id << std::endl;
        std::cout << "Username: " << user_info.username << std::endl;
        std::cout << "Role: " << user_info.role << std::endl;
        std::cout << "Owner ID: " << user_info.owner_id << std::endl;
    } else {
        std::cout << "Failed to get user info: " << user_info.message << std::endl;
    }
}
catch (const std::exception& e) {
    std::cout << "Error: " << e.what() << std::endl;
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Error Handling</h2>
        <p className="text-slate-300 mb-4">
          Always handle authentication errors properly:
        </p>
        <CodeBlock
          language="cpp"
          title="Comprehensive error handling"
          code={`try {
    auto login_response = client.login("user", "pass");

    if (!login_response.success) {
        // API returned an error
        std::cout << "API Error: " << login_response.message << std::endl;

        if (login_response.message.find("Invalid credentials") != std::string::npos) {
            // Wrong username/password
            // Prompt user to try again
        } else if (login_response.message.find("HWID") != std::string::npos) {
            // HWID mismatch - account is locked to different machine
        }
    }
}
catch (const AuthenticationException& e) {
    // Authentication-specific error
    std::cout << "Auth Error: " << e.what() << std::endl;
}
catch (const NetworkException& e) {
    // Network connectivity error
    std::cout << "Network Error: " << e.what() << std::endl;
    std::cout << "Check your internet connection and API URL" << std::endl;
}
catch (const SecurityException& e) {
    // Security validation failed
    std::cout << "Security Error: " << e.what() << std::endl;
}
catch (const std::exception& e) {
    // General error
    std::cout << "Error: " << e.what() << std::endl;
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Token Expiration</h2>
        <p className="text-slate-300 mb-4">
          JWT tokens expire after a set time (typically 24 hours). The LoginResponse includes expires_in which tells you how many seconds until expiration.
        </p>

        <p className="text-slate-300 mb-4">
          When a token expires, you'll get an authentication error on the next API call. Re-authenticate with login() to get a new token:
        </p>
        <CodeBlock
          language="cpp"
          title="Handling token expiration"
          code={`// Store token expiration time
auto login_resp = client.login("user", "pass");
auto expiry_time = std::time(nullptr) + login_resp.expires_in;

// Later, before making API calls, check if token might be expired
if (std::time(nullptr) >= expiry_time) {
    std::cout << "Token expired, re-authenticating..." << std::endl;

    // Get new token
    auto new_login = client.login("user", "pass");
    if (new_login.success) {
        std::cout << "New token obtained" << std::endl;
        expiry_time = std::time(nullptr) + new_login.expires_in;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Complete Example</h2>
        <CodeBlock
          language="cpp"
          title="Full authentication workflow"
          code={`#include "echoauth/client.hpp"
#include <iostream>
#include <windows.h>
#include <string>
#include <algorithm>

using namespace echoauth;

std::string get_hwid() {
    HW_PROFILE_INFO hw_profile;
    if (GetCurrentHwProfile(&hw_profile)) {
        std::string hwid;
        for (int i = 0; hw_profile.szHwProfileGuid[i] != 0; i++) {
            hwid += (char)hw_profile.szHwProfileGuid[i];
        }
        hwid.erase(std::remove(hwid.begin(), hwid.end(), '{'), hwid.end());
        hwid.erase(std::remove(hwid.begin(), hwid.end(), '}'), hwid.end());
        return hwid;
    }
    return "";
}

int main() {
    try {
        // Create client
        EchoAuthClient client("http://localhost:3001", "secret_...", true);

        // Get HWID
        std::string hwid = get_hwid();
        std::cout << "Machine HWID: " << hwid << std::endl;

        // Login with HWID locking
        std::cout << "\\nLogging in..." << std::endl;
        auto login_resp = client.login("testuser", "password123", hwid);

        if (login_resp.success) {
            std::cout << "✓ Login successful" << std::endl;
            std::cout << "  Token expires in: " << login_resp.expires_in << " seconds" << std::endl;

            // Get user info
            auto user_info = client.get_user_info();
            if (user_info.success) {
                std::cout << "\\n✓ User information:" << std::endl;
                std::cout << "  Username: " << user_info.username << std::endl;
                std::cout << "  Role: " << user_info.role << std::endl;
            }
        } else {
            std::cout << "✗ Login failed: " << login_resp.message << std::endl;
            return 1;
        }

        return 0;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Security Best Practices</h2>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Never hardcode credentials:</strong> Read username/password from user input or secure storage</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Always use HWID locking:</strong> Prevents account sharing and unauthorized access</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Monitor token expiration:</strong> Re-authenticate before token expires</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Clear tokens on logout:</strong> Call client.set_token("") when user logs out</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Use HTTPS in production:</strong> Always use SSL/TLS for API communication</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
