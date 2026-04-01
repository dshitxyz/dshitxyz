'use client';

import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useTranslations } from 'next-intl';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletStatus() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { switchChain } = useSwitchChain();
  const t = useTranslations('common');

  if (!isConnected) {
    return (
      <div className="p-4 bg-[#2D2D2D] border-2 border-[#F4D03F] rounded">
        <p className="text-white mb-4">{t('connectWallet')}</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#2D2D2D] border-2 border-[#F4D03F] rounded space-y-4">
      <div className="space-y-2">
        <h3 className="text-[#F4D03F] font-bold">Wallet Status</h3>
        <p className="text-gray-300 text-sm">
          <span className="text-white">Address:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <p className="text-gray-300 text-sm">
          <span className="text-white">Chain:</span> {chain?.name || 'Unknown'}
        </p>
        {balance && (
          <p className="text-gray-300 text-sm">
            <span className="text-white">Balance:</span> {balance.formatted.slice(0, 6)} {balance.symbol}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => switchChain?.({ chainId: base.id })}
          className="flex-1 px-3 py-2 bg-[#F4D03F] text-[#1A1A1A] font-bold text-sm hover:bg-[#D4AC0D] transition rounded"
          disabled={chain?.id === base.id}
        >
          Base Mainnet
        </button>
        <button
          onClick={() => switchChain?.({ chainId: baseSepolia.id })}
          className="flex-1 px-3 py-2 bg-[#F4D03F] text-[#1A1A1A] font-bold text-sm hover:bg-[#D4AC0D] transition rounded"
          disabled={chain?.id === baseSepolia.id}
        >
          Base Sepolia
        </button>
      </div>

      <button
        onClick={() => {}} // Disconnect would be handled by RainbowKit
        className="w-full px-3 py-2 bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition rounded"
      >
        {t('disconnect')}
      </button>
    </div>
  );
}
