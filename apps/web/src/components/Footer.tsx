'use client';

import { LocaleSwitcher } from './LocaleSwitcher';

export function Footer() {
  return (
    <footer
      className="mt-8 border-t border-gray-200 bg-gray-50 py-8 px-4"
      style={{
        borderTopColor: 'var(--shit-brown, #8B4513)',
        backgroundColor: 'var(--bg-waste, #3D3D3D)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-8">
          {/* Brand */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: 'var(--shit-yellow, #F4D03F)' }}
            >
              dshit.xyz
            </h3>
            <p className="text-sm text-gray-400">
              Decentralized meme commerce platform on Base L2.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/gallery" className="hover:text-gray-200 transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-gray-200 transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/meme-creator" className="hover:text-gray-200 transition-colors">
                  Meme Creator
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-gray-200 transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://twitter.com/dshitxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/dshit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/dshitxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Language Switcher */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Language</h4>
            <LocaleSwitcher />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2026 dshit.xyz - Built with 💩</p>
          <div className="flex gap-4 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="/docs/privacy" className="hover:text-gray-200 transition-colors">
              Privacy
            </a>
            <a href="/docs/terms" className="hover:text-gray-200 transition-colors">
              Terms
            </a>
            <a href="/docs/security" className="hover:text-gray-200 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
