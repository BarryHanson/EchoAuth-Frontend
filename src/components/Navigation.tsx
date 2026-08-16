'use client';

import { useAuthStore } from '@/stores/authStore';
import { PermissionChecker, getRoleDisplay } from '@/lib/permissions';
import {
  BarChart3,
  Key,
  Gamepad2,
  LogOut,
  Menu,
  X,
  Shield,
  Settings,
  Users,
  Download,
  User,
  ChevronDown,
  Building2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!isAuthenticated || pathname === '/' || pathname.startsWith('/documentation')) {
    return null;
  }

  const isAdmin = PermissionChecker.canAccessAdmin(user?.role || '');
  const isGod = user?.role === 'god';
  const isOwner = user?.role === 'owner';
  const isSeller = user?.role === 'seller';
  const isUser = user?.role === 'user';

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: any }) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setIsOpen(false);
        window.location.href = href;
      }}
      className="flex items-center gap-2 text-slate-300 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg px-3 py-2 transition-all font-medium text-sm"
    >
      {children}
    </a>
  );

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
              className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                EchoAuth
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {(isGod || isOwner) && (
              <NavLink href="/dashboard/owner">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
            )}

            {isSeller && (
              <NavLink href="/dashboard/seller">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
            )}

            {!isUser && (
              <NavLink href="/keys">
                <Key className="w-4 h-4" />
                Keys
              </NavLink>
            )}

            {(isGod || isOwner) && (
              <>
                <NavLink href="/dashboard/owner/users">
                  <Users className="w-4 h-4" />
                  Users
                </NavLink>
                <NavLink href="/dashboard/owner/sellers">
                  <Users className="w-4 h-4" />
                  Sellers
                </NavLink>
                <NavLink href="/owners">
                  <Building2 className="w-4 h-4" />
                  Programs
                </NavLink>
              </>
            )}

            {!isUser && !isSeller && (
              <>
                <NavLink href="/logs">
                  <BarChart3 className="w-4 h-4" />
                  Logs
                </NavLink>
                <NavLink href="/bans">
                  <Shield className="w-4 h-4" />
                  Bans
                </NavLink>
              </>
            )}

            {(isGod || isOwner) && (
              <NavLink href="/cheats">
                <Gamepad2 className="w-4 h-4" />
                Cheats
              </NavLink>
            )}

            <NavLink href="/settings">
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>

            {(isGod || isOwner) && (
              <NavLink href="/loaders">
                <Download className="w-4 h-4" />
                Loaders
              </NavLink>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Role Badge */}
            <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-900/40 to-cyan-900/40 text-blue-300 border border-blue-700/50">
              {getRoleDisplay(user?.role || '')}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-700"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline">{user?.username}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-semibold text-white">{user?.username}</p>
                    <p className="text-xs text-slate-400">{getRoleDisplay(user?.role || '')}</p>
                  </div>
                  <a
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProfileOpen(false);
                      window.location.href = '/profile';
                    }}
                    className="block px-4 py-2 hover:bg-slate-800 transition flex items-center gap-2 text-slate-300 hover:text-white"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 transition flex items-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Logout */}
          <div className="md:hidden">
            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 transition p-2">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700 pt-2 space-y-1">
            {(isGod || isOwner) && (
              <NavLink href="/dashboard/owner">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
            )}

            {isSeller && (
              <NavLink href="/dashboard/seller">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
            )}

            {!isUser && (
              <NavLink href="/keys">
                <Key className="w-4 h-4" />
                Keys
              </NavLink>
            )}

            {(isGod || isOwner) && (
              <>
                <NavLink href="/dashboard/owner/users">
                  <Users className="w-4 h-4" />
                  Users
                </NavLink>
                <NavLink href="/dashboard/owner/sellers">
                  <Users className="w-4 h-4" />
                  Sellers
                </NavLink>
                <NavLink href="/owners">
                  <Building2 className="w-4 h-4" />
                  Programs
                </NavLink>
              </>
            )}

            {!isUser && !isSeller && (
              <>
                <NavLink href="/logs">
                  <BarChart3 className="w-4 h-4" />
                  Logs
                </NavLink>
                <NavLink href="/bans">
                  <Shield className="w-4 h-4" />
                  Bans
                </NavLink>
              </>
            )}

            {(isGod || isOwner) && (
              <NavLink href="/cheats">
                <Gamepad2 className="w-4 h-4" />
                Cheats
              </NavLink>
            )}

            <NavLink href="/settings">
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>

            {(isGod || isOwner) && (
              <NavLink href="/loaders">
                <Download className="w-4 h-4" />
                Loaders
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
