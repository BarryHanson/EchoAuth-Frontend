export interface DocPage {
  title: string;
  description: string;
  href: string;
  content: string;
  category: string;
}

export const docsIndex: DocPage[] = [
  {
    title: 'Getting Started',
    description: 'Overview and introduction to EchoAuth',
    href: '/documentation',
    content: 'EchoAuth authentication introduction getting started',
    category: 'Getting Started',
  },
  {
    title: 'C++ Library Overview',
    description: 'Architecture and components of the EchoAuth library',
    href: '/documentation/cpp-library',
    content: 'C++ library architecture components EchoAuthClient Crypto',
    category: 'C++ Library',
  },
  {
    title: 'Installation & Build',
    description: 'Step-by-step guide to integrate the library in Visual Studio',
    href: '/documentation/cpp-library/installation',
    content: 'installation build visual studio setup requirements dependencies wininet advapi32',
    category: 'C++ Library',
  },
  {
    title: 'Authentication',
    description: 'Login, HWID locking, and token management',
    href: '/documentation/cpp-library/authentication',
    content: 'authentication login HWID locking token management session JWT bearer',
    category: 'C++ Library',
  },
  {
    title: 'Cryptography',
    description: 'XOR encryption, HMAC-SHA256, hashing, and secure operations',
    href: '/documentation/cpp-library/cryptography',
    content: 'cryptography XOR encryption HMAC-SHA256 hash base64 random bytes secure',
    category: 'C++ Library',
  },
  {
    title: 'Downloading Cheats',
    description: 'Download and handle encrypted cheat modules',
    href: '/documentation/cpp-library/downloading-cheats',
    content: 'download cheat module encrypted decryption status detected undetected',
    category: 'C++ Library',
  },
  {
    title: 'Error Handling',
    description: 'Exception hierarchy and error recovery strategies',
    href: '/documentation/cpp-library/error-handling',
    content: 'error handling exceptions NetworkException AuthenticationException retry exponential backoff',
    category: 'C++ Library',
  },
  {
    title: 'Best Practices',
    description: 'Security, performance, and maintenance guidelines',
    href: '/documentation/cpp-library/best-practices',
    content: 'best practices security credentials HTTPS token performance caching updates',
    category: 'C++ Library',
  },
  {
    title: 'API Reference',
    description: 'Complete API endpoint reference and documentation',
    href: '/documentation/api-reference',
    content: 'API reference endpoints authentication rate limiting response codes',
    category: 'API Reference',
  },
  {
    title: 'Authentication Endpoints',
    description: 'User registration and login API endpoints',
    href: '/documentation/api-reference/authentication',
    content: 'authentication endpoints login register JWT token',
    category: 'API Reference',
  },
  {
    title: 'Client Endpoints',
    description: 'Client application integration endpoints',
    href: '/documentation/api-reference/client',
    content: 'client endpoints download version check logging',
    category: 'API Reference',
  },
  {
    title: 'Admin Endpoints',
    description: 'Program and license management endpoints',
    href: '/documentation/api-reference/admin',
    content: 'admin endpoints key generation cheat management user management',
    category: 'API Reference',
  },
  {
    title: 'Security Practices',
    description: 'Comprehensive security features and best practices',
    href: '/documentation/security',
    content: 'security practices JWT HMAC HWID IP locking timestamp drift XOR encryption debugger detection',
    category: 'Security',
  },
];

export function searchDocs(query: string): DocPage[] {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(/\s+/);

  return docsIndex
    .filter((page) => {
      const searchText = `${page.title} ${page.description} ${page.content}`.toLowerCase();
      return searchTerms.every((term) => searchText.includes(term));
    })
    .sort((a, b) => {
      // Sort by title match first, then alphabetically
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const query_lower = query.toLowerCase();

      if (aTitle.startsWith(query_lower) && !bTitle.startsWith(query_lower)) return -1;
      if (!aTitle.startsWith(query_lower) && bTitle.startsWith(query_lower)) return 1;

      return aTitle.localeCompare(bTitle);
    });
}
