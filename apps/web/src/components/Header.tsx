'use client';

import React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { isConnected } = useAccount();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="border-b-4 border-shit-yellow bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-shit-yellow cursor-pointer hover:text-shit-yellow-dark transition-colors">
              D-SHIT™
            </h1>
          </Link>

          {/* Navigation & Wallet */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex gap-6 text-gray-300 font-body text-sm">
              <Link href="/gallery" className="hover:text-shit-yellow transition-colors">
                GALLERY
              </Link>
              <Link href="/partnerships" className="hover:text-shit-yellow transition-colors">
                PARTNERS
              </Link>
              {isConnected && (
                <>
                  <Link href="/dashboard" className="hover:text-shit-yellow transition-colors">
                    DASHBOARD
                  </Link>
                  <Link href="/analytics" className="hover:text-shit-yellow transition-colors">
                    ANALYTICS
                  </Link>
                </>
              )}
            </nav>

            {/* User Profile Section */}
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded border border-gray-700">
                <div className="text-right">
                  <p className="text-gray-400 text-xs">User</p>
                  <p className="text-shit-yellow font-mono text-sm">{user.pseudonym}</p>
                </div>
              </div>
            )}

            {/* RainbowKit Connect Button */}
            <div className="scale-75 md:scale-100 origin-right">
              <ConnectButton />
            </div>

            {/* Logout Button */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden md:block px-3 py-2 text-xs text-gray-400 hover:text-glitch-red transition-colors border border-gray-700 rounded hover:border-glitch-red"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
