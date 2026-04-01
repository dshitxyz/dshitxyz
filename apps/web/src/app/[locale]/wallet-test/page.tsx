import { WalletStatus } from '@/components/WalletStatus';

export default async function WalletTestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#F4D03F] mb-2 font-display">
          Wallet Integration Test
        </h1>
        <p className="text-gray-300">
          This page verifies that wallet integration is working correctly with wagmi v2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Current Status</h2>
          <WalletStatus />
        </div>

        <div className="bg-[#2D2D2D] border-2 border-[#F4D03F] rounded p-4">
          <h2 className="text-xl font-bold text-[#F4D03F] mb-4">Test Checklist</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#F4D03F] font-bold">✓</span>
              <span>Connect wallet using RainbowKit button</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F4D03F] font-bold">✓</span>
              <span>Verify address displays correctly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F4D03F] font-bold">✓</span>
              <span>Check balance displays (ETH or test tokens)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F4D03F] font-bold">✓</span>
              <span>Switch between Base Mainnet and Sepolia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F4D03F] font-bold">✓</span>
              <span>Test on multiple pages (navigate away and back)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F4D03F] font-bold">✓</span>
              <span>Verify works across all locales (/en/, /es/, /fr/, /de/)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-[#2D2D2D] border-2 border-[#F4D03F] rounded p-4">
        <h2 className="text-xl font-bold text-[#F4D03F] mb-4">Technical Details</h2>
        <ul className="space-y-2 text-sm text-gray-300 font-mono">
          <li><span className="text-[#F4D03F]">Library:</span> wagmi v2 + RainbowKit</li>
          <li><span className="text-[#F4D03F]">Provider:</span> WagmiProvider with Base chain config</li>
          <li><span className="text-[#F4D03F]">Hooks Used:</span> useAccount, useBalance, useSwitchChain</li>
          <li><span className="text-[#F4D03F]">Chains:</span> Base Mainnet, Base Sepolia</li>
          <li><span className="text-[#F4D03F]">Status:</span> <span className="text-green-400">✅ Configured</span></li>
        </ul>
      </div>
    </div>
  );
}
