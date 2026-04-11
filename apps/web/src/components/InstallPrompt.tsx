'use client';

import React, { useEffect, useState } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallPrompt() {
  const { canInstall, showPrompt, dismissPrompt } = useInstallPrompt();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this session
    const dismissed = sessionStorage.getItem('installPromptDismissed');
    if (!dismissed && canInstall) {
      // Small delay to avoid jarring appearance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!isVisible) return null;

  const handleInstall = async () => {
    const success = await showPrompt();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 transform transition-transform duration-300 ease-out z-40 animate-in slide-in-from-bottom-4"
      style={{
        animation: 'slideUp 0.3s ease-out forwards',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={handleDismiss}
        style={{ height: '100vh', bottom: 'auto', top: 0 }}
      />

      {/* Install Banner */}
      <div className="relative mx-4 mb-4 bg-gray-900 border-4 border-shit-yellow rounded-sm box-shadow-sm shadow-lg overflow-hidden">
        {/* Glitch accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-shit-yellow via-glitch-red to-toxic-green" />

        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-display text-xl md:text-2xl text-shit-yellow uppercase tracking-wider mb-2">
                📱 Install App
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Add DSHIT to your home screen for quick access. Works offline with cached content!
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-glitch-red transition-colors text-xl leading-none"
              aria-label="Dismiss install prompt"
            >
              ✕
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-shit-yellow text-gray-900 font-display font-bold uppercase text-sm border-3 border-shit-brown rounded-sm cursor-pointer transition-all hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] shadow-md"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-700 text-gray-100 font-body font-bold uppercase text-sm border-2 border-gray-600 rounded-sm cursor-pointer transition-all hover:border-gray-500 hover:bg-gray-600"
            >
              Maybe Later
            </button>
          </div>

          {/* Features list */}
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>✓ Offline access to cached content</p>
            <p>✓ Works on home screen like native app</p>
            <p>✓ No app store required</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .relative {
            margin-bottom: 0;
            border-radius: 0.25rem 0.25rem 0 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Compact install button for header
 * Use this for a small, inline install button in the navbar
 */
export function InstallButtonHeader() {
  const { canInstall, showPrompt } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      onClick={showPrompt}
      className="hidden sm:block px-3 py-2 text-xs text-gray-400 hover:text-shit-yellow transition-colors border border-gray-700 rounded hover:border-shit-yellow"
      title="Install app to home screen"
    >
      📥 INSTALL
    </button>
  );
}
