# EchoAuth - Frontend Dashboard & Documentation

A modern, professional web application built with Next.js and React providing user authentication, dashboard management, landing page, and comprehensive API documentation.

## Features

### User Interface
- 🎨 **Glassmorphism Design** - Modern backdrop-blur UI with gradient effects
- 🌙 **Dark Mode** - Built-in dark theme optimized for eye comfort
- 📱 **Responsive Design** - Mobile-first approach, works on all screen sizes
- ⚡ **Fast Performance** - Next.js 14 with optimized loading

### Authentication & Dashboard
- 🔐 **JWT Authentication** - Secure login and registration system
- 👤 **User Dashboard** - Personal program ownership and settings
- 🔑 **API Key Management** - View and manage API keys per program
- 📊 **Statistics** - View requests, latency, active sessions, uptime
- 🛠️ **Program Settings** - Configure program-specific options (HWID lock, IP lock, etc.)
- 🎮 **Cheat Management** - View and manage owned cheats
- 🚫 **HWID/IP Management** - View and reset locked sessions

### Landing Page
- 📍 **Hero Section** - Feature showcase with CTA
- 💡 **Key Features Display** - Highlighted security features
- 📈 **Live Statistics** - Real-time system stats (requests, latency, sessions, uptime)
- 🔒 **Security Highlights** - HWID locking, token gating, webhook alerts
- 📱 **Call-to-Action** - Login/Register buttons in responsive nav

### Documentation Site
- 📚 **Comprehensive Guides** - C++ library, loader, and API documentation
- 🔍 **Search Functionality** - Full-text search across all documentation
- 💻 **Code Examples** - Complete C++ code samples with syntax highlighting
- 🏷️ **Category Organization** - Documentation organized by section
- 🌐 **Multi-Language Ready** - Framework for supporting multiple languages
- 📖 **Detailed Topics**:
  - C++ Library Overview & Installation
  - Authentication & HWID Locking
  - Cryptography (XOR, HMAC-SHA256, hashing)
  - Cheat Download & Decryption
  - Error Handling & Exceptions
  - Best Practices & Security Guidelines
  - API Reference (endpoints, rate limiting, signatures)
  - Security Practices & Features

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running on port 3001 (see backend README)

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Routes

### Public Routes
- `/` - Landing page with features and stats
- `/login` - User login
- `/register` - User registration
- `/documentation` - Documentation hub
- `/documentation/cpp-library` - C++ library guide
- `/documentation/cpp-library/installation` - Installation guide
- `/documentation/cpp-library/authentication` - Authentication guide
- `/documentation/cpp-library/cryptography` - Cryptography guide
- `/documentation/cpp-library/downloading-cheats` - Cheat download guide
- `/documentation/cpp-library/error-handling` - Error handling guide
- `/documentation/cpp-library/best-practices` - Best practices guide
- `/documentation/api-reference` - API reference
- `/documentation/security` - Security practices

### Protected Routes (requires authentication)
- `/dashboard` - Main user dashboard
- `/dashboard/programs` - User programs and keys
- `/dashboard/settings` - User account settings
- `/cheats` - Program cheats management

## Building

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── register/
│   │   └── page.tsx                # Registration page
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout
│   │   ├── page.tsx                # Dashboard home
│   │   ├── programs/
│   │   │   └── page.tsx            # Programs/keys page
│   │   ├── settings/
│   │   │   └── page.tsx            # Settings page
│   │   └── [...slug]/page.tsx      # Dynamic settings
│   ├── cheats/
│   │   └── page.tsx                # Cheats management
│   └── documentation/
│       ├── layout.tsx              # Docs layout
│       ├── page.tsx                # Documentation hub
│       ├── cpp-library/
│       │   ├── page.tsx
│       │   ├── installation/
│       │   ├── authentication/
│       │   ├── cryptography/
│       │   ├── downloading-cheats/
│       │   ├── error-handling/
│       │   └── best-practices/
│       ├── api-reference/
│       │   ├── page.tsx
│       │   ├── authentication/
│       │   ├── client/
│       │   └── admin/
│       └── security/
│           └── page.tsx
├── components/
│   ├── CodeBlock.tsx               # Syntax-highlighted code blocks
│   ├── DocsSearch.tsx              # Documentation search
│   ├── DashboardNav.tsx            # Dashboard navigation
│   ├── Footer.tsx                  # Footer component
│   ├── ThemeToggle.tsx             # Dark mode toggle
│   └── [other components]
├── lib/
│   ├── api.ts                      # API client
│   ├── docsearch.ts                # Documentation search index
│   └── utils.ts                    # Utility functions
├── stores/
│   ├── authStore.ts                # Auth state (Zustand)
│   └── [other stores]
├── styles/
│   └── globals.css                 # Global styles
└── types/
    └── index.ts                    # TypeScript types
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **date-fns** - Modern date utilities
- **next/link** - Optimized client-side navigation

## Features Breakdown

### Landing Page
- Hero section with gradient text and animations
- Feature cards highlighting key capabilities
- Live statistics dashboard
- Responsive navigation with auth-aware buttons
- Call-to-action for login/registration
- Professional footer

### Dashboard
- Clean sidebar navigation
- Program/key management with search and filtering
- Settings page for account configuration
- HWID and IP reset functionality
- Real-time data updates
- User profile section

### Documentation
- Sidebar navigation with collapsible sections
- Full-text search with dropdown results
- Syntax-highlighted code blocks (C++ specific)
- Language selector (framework for multi-language)
- Responsive design with mobile sidebar
- Copy-to-clipboard for code snippets
- Breadcrumb navigation

### Authentication
- JWT token-based auth
- Protected routes with auth middleware
- Login form with email/password
- Registration form with validation
- Session management in browser storage
- Automatic token refresh

## Authentication Flow

1. User logs in with email and password
2. Backend returns JWT token
3. Token stored in browser storage (localStorage)
4. Token included in Authorization header for protected requests
5. Protected routes redirect to login if not authenticated
6. Token used for 24 hours, must re-login after expiry

## API Integration

All API requests are handled in `src/lib/api.ts` using Axios. 

Endpoints used:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info
- `GET /api/owner/keys` - Get API keys
- `GET /api/owner/cheats` - Get cheats
- `PUT /api/owner/cheats/:id` - Update cheat settings
- `GET /api/owner/stats` - Get statistics

## Code Examples in Documentation

The documentation site includes complete, working examples for:
- Basic authentication and login
- HWID locking for session binding
- XOR encryption/decryption of cheat modules
- HMAC-SHA256 signature verification
- Error handling with retry logic
- Response validation and error recovery

All examples are syntax-highlighted and copy-paste ready.

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Authentication middleware on sensitive pages
- **HTTPS Ready** - Configured for production SSL/TLS
- **CORS Protection** - Backend CORS configuration
- **Secure Token Storage** - Tokens in localStorage (production: consider httpOnly cookies)
- **Input Validation** - Frontend form validation before submission
- **Content Security** - No inline scripts, safe component rendering

## Development Tips

1. **Hot Reload** - Changes auto-reload during development
2. **TypeScript** - Use types for better autocomplete
3. **Tailwind Utilities** - Use responsive classes (sm:, md:, lg:, xl:)
4. **Documentation Search** - Test with queries like "authentication", "cryptography"
5. **Dark Mode** - Toggle with theme selector to test both modes

## Troubleshooting

**API Connection Errors**
- Ensure backend is running on `http://localhost:3001`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Authentication Issues**
- Clear browser storage and re-login
- Check that backend JWT_SECRET matches

**Build Errors**
- Delete `.next` folder and rebuild
- Run `npm install` again to ensure all dependencies

**Documentation Search Not Working**
- Ensure all documentation pages are accessible
- Check browser console for errors
- Clear browser cache

## License

Proprietary - EchoAuth
