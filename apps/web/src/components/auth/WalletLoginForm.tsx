'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function WalletLoginForm() {
  const { address, isConnected } = useAccount();
  const { signMessage, isPending } = useSignMessage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) return;

    const handleSignIn = async () => {
      if (!address) return;

      try {
        setIsLoading(true);
        setError(null);

        // Create a message to sign
        const timestamp = Date.now();
        const message = `Sign in to dshit.xyz\n\nAddress: ${address}\nTimestamp: ${timestamp}`;

        // Request signature
        signMessage(
          { message },
          {
            onSuccess: async (signature) => {
              // Verify signature on backend
              const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  address,
                  signature,
                  message,
                  timestamp,
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Authentication failed');
              }

              const data = await response.json();

              // Store auth token
              if (data.token) {
                localStorage.setItem('auth_token', data.token);
              }

              // Redirect to dashboard
              router.push('/dashboard');
            },
            onError: (error) => {
              setError(error.message || 'Failed to sign message');
            },
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    handleSignIn();
  }, [isConnected, address, signMessage, router]);

  if (!isConnected) {
    return (
      <div className="text-center">
        <p className="text-gray-300 mb-6 font-body">Connect your wallet to continue</p>
        <p className="text-gray-500 text-sm">
          Your wallet is your identity. No password needed.
        </p>
      </div>
    );
  }

  if (isLoading || isPending) {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin mb-4">
          <div className="h-8 w-8 border-4 border-shit-yellow border-t-transparent rounded-full"></div>
        </div>
        <p className="text-gray-300 font-body">Signing in...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-glitch-red mb-4 font-body">{error}</p>
        <button
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
          className="shit-button text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-gray-300 mb-4 font-body">Verifying wallet...</p>
    </div>
  );
}
