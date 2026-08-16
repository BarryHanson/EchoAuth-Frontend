'use client';

import { CodeBlock } from '@/components/CodeBlock';

export default function InstallationPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-4">Installation & Build</h1>
      <p className="text-xl text-slate-400 mb-12">
        Step-by-step guide to integrating the EchoAuth C++ library into your Visual Studio project.
      </p>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">System Requirements</h2>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Windows 10</strong> or later</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Visual Studio 2017</strong> or later (2019, 2022 recommended)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>C++11</strong> or later standard</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>x64</strong> architecture (32-bit support available upon request)</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Step 1: Get the Library</h2>
        <p className="text-slate-300 mb-4">
          The EchoAuth library files should be provided to you. You'll receive:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><code className="bg-slate-800 px-2 py-1 rounded text-sm">libEchoAuthLib.lib</code> - Static library (x64)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><code className="bg-slate-800 px-2 py-1 rounded text-sm">echoauth/</code> - Header files</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Step 2: Create/Open Your Project</h2>
        <p className="text-slate-300 mb-4">
          Create a new C++ Console Application (or use an existing one) in Visual Studio. Ensure it's configured for:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Platform: <strong>x64</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>C++ Standard: <strong>C++11</strong> or later</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Step 3: Add Library Files</h2>
        <p className="text-slate-300 mb-4">
          In your project directory, create a folder structure like this:
        </p>
        <CodeBlock
          language="cpp"
          title="Directory structure"
          code={`MyProject/
├── MyProject.sln
├── MyProject/
│   ├── MyProject.vcxproj
│   ├── main.cpp
│   ├── lib/
│   │   └── libEchoAuthLib.lib
│   └── include/
│       └── echoauth/
│           ├── client.hpp
│           ├── crypto.hpp
│           ├── exceptions.hpp
│           └── response.hpp`}
        />

        <h2 className="text-2xl font-bold text-white mb-4">Step 4: Configure Project Properties</h2>
        <p className="text-slate-300 mb-4">
          Right-click your project → Properties → Configure for <strong>x64 Release</strong> or <strong>Debug</strong>
        </p>

        <h3 className="text-lg font-semibold text-white mb-3">Add Include Directories</h3>
        <p className="text-slate-300 mb-3">
          <strong>Project Properties → VC++ Directories → Include Directories</strong>
        </p>
        <p className="text-slate-300 mb-4">Add the path to your include folder:</p>
        <CodeBlock
          language="cpp"
          title="Include path example"
          code={`$(ProjectDir)include`}
        />

        <h3 className="text-lg font-semibold text-white mb-3">Add Library Directories</h3>
        <p className="text-slate-300 mb-3">
          <strong>Project Properties → VC++ Directories → Library Directories</strong>
        </p>
        <p className="text-slate-300 mb-4">Add the path to your lib folder:</p>
        <CodeBlock
          language="cpp"
          title="Library path example"
          code={`$(ProjectDir)lib`}
        />

        <h3 className="text-lg font-semibold text-white mb-3">Link the Library</h3>
        <p className="text-slate-300 mb-3">
          <strong>Project Properties → Linker → Input → Additional Dependencies</strong>
        </p>
        <p className="text-slate-300 mb-4">Add:</p>
        <CodeBlock
          language="cpp"
          title="Additional dependencies"
          code={`libEchoAuthLib.lib
wininet.lib
crypt32.lib
advapi32.lib`}
        />

        <h3 className="text-lg font-semibold text-white mb-3">Add Library Dependencies</h3>
        <p className="text-slate-300 mb-4">
          The EchoAuth library uses Windows libraries that must be linked. The library automatically uses:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><code className="bg-slate-800 px-2 py-1 rounded text-sm">wininet.lib</code> - HTTP communication (WinInet API)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><code className="bg-slate-800 px-2 py-1 rounded text-sm">advapi32.lib</code> - Cryptography API (CryptoAPI)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span><code className="bg-slate-800 px-2 py-1 rounded text-sm">crypt32.lib</code> - Certificate and crypto functions</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Step 5: Verify Installation</h2>
        <p className="text-slate-300 mb-4">
          Create a simple test file to verify everything is set up correctly:
        </p>
        <CodeBlock
          language="cpp"
          title="test.cpp"
          code={`#include <iostream>
#include "echoauth/client.hpp"

int main() {
    try {
        echoauth::EchoAuthClient client(
            "http://localhost:3001",
            "secret_test",
            true
        );
        std::cout << "EchoAuth library loaded successfully!" << std::endl;
        return 0;
    }
    catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return 1;
    }
}`}
        />

        <p className="text-slate-300 mb-4">
          Compile and run this test. If it compiles without errors and prints "EchoAuth library loaded successfully!", your setup is correct.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">Troubleshooting</h2>

        <div className="space-y-6 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-red-400 mb-2">LNK1104: Cannot open file 'libEchoAuthLib.lib'</h3>
            <p className="text-sm text-slate-300 mb-2">
              <strong>Solution:</strong> Verify the Library Directories path is correct and the .lib file exists in that location.
            </p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Check that the path uses forward slashes or escaped backslashes</li>
              <li>• Verify the .lib file name matches exactly (case-sensitive)</li>
              <li>• Make sure you're using the x64 version if your project is x64</li>
            </ul>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-red-400 mb-2">C1083: Cannot open include file: 'echoauth/client.hpp'</h3>
            <p className="text-sm text-slate-300 mb-2">
              <strong>Solution:</strong> Verify the Include Directories path is correct.
            </p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Check that the echoauth folder exists in the include directory</li>
              <li>• Verify all header files are present in the echoauth folder</li>
              <li>• Rebuild the project (Clean Solution → Rebuild)</li>
            </ul>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-red-400 mb-2">LNK2019: Unresolved external symbol</h3>
            <p className="text-sm text-slate-300 mb-2">
              <strong>Solution:</strong> Verify all required libraries are linked in Additional Dependencies.
            </p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Ensure libEchoAuthLib.lib is listed</li>
              <li>• Add missing system libraries: wininet.lib, advapi32.lib, crypt32.lib</li>
              <li>• Check platform matches (x64 project needs x64 library)</li>
            </ul>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-red-400 mb-2">Runtime error at startup</h3>
            <p className="text-sm text-slate-300 mb-2">
              <strong>Solution:</strong> Ensure your project is linked against the correct CRT (C Runtime).
            </p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Project Properties → C/C++ → Code Generation → Runtime Library</li>
              <li>• Use "Multi-threaded DLL (/MD)" for Release</li>
              <li>• Use "Multi-threaded Debug DLL (/MDd)" for Debug</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Building for Release</h2>
        <p className="text-slate-300 mb-4">
          When building for release, make sure to:
        </p>
        <ul className="space-y-2 text-slate-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Use <strong>Release</strong> configuration (not Debug)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Enable optimizations: <strong>/O2</strong> (Maximize Speed)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Use Runtime Library: <strong>/MD</strong> (Multi-threaded DLL)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Consider code obfuscation for production</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">Next Steps</h2>
        <p className="text-slate-300 mb-4">
          Once installation is complete, learn how to use the library:
        </p>
        <ul className="space-y-2 text-slate-300">
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">→</span>
            <span><a href="/documentation/cpp-library/authentication" className="text-cyan-400 hover:text-cyan-300 transition">Authentication Guide</a> - Learn login and token management</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">→</span>
            <span><a href="/documentation/cpp-library/cryptography" className="text-cyan-400 hover:text-cyan-300 transition">Cryptography Guide</a> - Understand encryption and signatures</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">→</span>
            <span><a href="/documentation/cpp-library/downloading-cheats" className="text-cyan-400 hover:text-cyan-300 transition">Downloading Cheats</a> - Download and decrypt modules</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
