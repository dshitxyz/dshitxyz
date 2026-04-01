'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-16 border-t-4 border-yellow-400 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top section with 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-bebas text-2xl font-bold text-yellow-400 mb-4">
              💩 DSHIT
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/dshitxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.29 20a11.6 11.6 0 0011.6-11.6c0-.175 0-.35-.01-.525A8.3 8.3 0 0020 3.44a8.15 8.15 0 01-2.36.647A4.1 4.1 0 0019.54 2.34a8.2 8.2 0 01-2.605.995A4.1 4.1 0 0013.85 2c-2.27 0-4.1 1.84-4.1 4.1 0 .32.04.64.12.94a11.64 11.64 0 01-8.45-4.29 4.1 4.1 0 001.27 5.49A4.08 4.08 0 01.96 8.04v.05a4.1 4.1 0 003.28 4.02 4.1 4.1 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.23 8.23 0 010 17.75a11.57 11.57 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://discord.gg/dshitxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Discord"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3671a19.8062 19.8062 0 00-4.8851-1.5152.074.074 0 00-.0787.0368c-.211.3748-.444.8635-.607 1.2495.5976-.0913 1.1851-.2227 1.7614-.4059a.077.077 0 00.0765-.1021c-.0427-.1365-.0734-.2822-.1019-.4289a.0743.0743 0 00-.0529-.0411z" />
                </svg>
              </a>
              <a
                href="https://telegram.me/dshitxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0011.944 0zm4.962 7.224c.1865 4.9294-.7840 6.7522-4.0341 6.6650-.5624-.0148-1.1300.2622-1.1300.2622l-2.2152 6.7125c-.1065.3337-.3342.5922-.6511.6571-.3628.0733-.7349-.1244-.9289-.3782l-5.4464-7.1046-2.712 2.712c-.37.37-.8474.5236-1.3322.3445-.4847-.1790-.7964-.6549-.7964-1.6131V4.28zpL3.98 15.291c-.1065.3337-.3342.5922-.6511.6571-.3628.0733-.7349-.1244-.9289-.3782l-5.4464-7.1046-2.712 2.712c-.37.37-.8474.5236-1.3322.3445-.4847-.1790-.7964-.6549-.7964-1.6131V4.28z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4 text-gray-300">
              {t('links')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('gallery')}
                </Link>
              </li>
              <li>
                <Link href="/meme-creator" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('creator')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4 text-gray-300">
              {t('resources')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/dshitxyz" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('github')}
                </a>
              </li>
              <li>
                <a href="https://docs.dshitxyz.com" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('docs')}
                </a>
              </li>
              <li>
                <a href="https://contract.dshitxyz.com" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  {t('contract')}
                </a>
              </li>
            </ul>
          </div>

          {/* Locale Switcher */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4 text-gray-300">
              {t('settings')}
            </h4>
            <div className="mb-4">
              <LocaleSwitcher />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            &copy; 2026 dshit.xyz. {t('rights')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
              {t('privacy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
              {t('terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
