'use client';

import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UseInstallPrompt {
  canInstall: boolean;
  installPromptEvent: InstallPromptEvent | null;
  showPrompt: () => Promise<boolean>;
  isInstalled: boolean;
  dismissPrompt: () => void;
}

/**
 * Hook to handle Web App Install Prompt
 * Listens for beforeinstallprompt event and provides install functionality
 */
export function useInstallPrompt(): UseInstallPrompt {
  const [canInstall, setCanInstall] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();

      // Stash the event for later use
      setInstallPromptEvent(e as InstallPromptEvent);
      setCanInstall(true);
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setInstallPromptEvent(null);
    };

    // Check display-mode changes (for detecting uninstall)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
      if (!e.matches) {
        // App was uninstalled
        setCanInstall(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  /**
   * Show the install prompt to the user
   */
  const showPrompt = async (): Promise<boolean> => {
    if (!installPromptEvent) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      // Show the prompt
      await installPromptEvent.prompt();

      // Wait for user choice
      const { outcome } = await installPromptEvent.userChoice;

      if (outcome === 'accepted') {
        console.log('App installation accepted');
        setCanInstall(false);
        return true;
      } else {
        console.log('App installation dismissed');
        // Don't immediately hide the install option, but mark as dismissed
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  };

  /**
   * Dismiss the install prompt
   */
  const dismissPrompt = () => {
    setCanInstall(false);
    // Store dismissal in localStorage to hide for a while
    sessionStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  return {
    canInstall,
    installPromptEvent,
    showPrompt,
    isInstalled,
    dismissPrompt,
  };
}
