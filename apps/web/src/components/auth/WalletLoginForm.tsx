'use client';

import { useState } from 'react';

export function WalletLoginForm() {
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    // TODO: Implement wallet connection in Phase 2
    setError('Wallet integration coming in Phase 2');
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleConnect}
        className="w-full px-4 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
      >
        Connect Wallet
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <p className="text-sm text-gray-500 text-center">
        Wallet integration will be enabled in Phase 2 (Frontend). For now, Phase 0 focuses on scaffolding.
      </p>
    </div>
  );
}
