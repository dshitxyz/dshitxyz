'use client';

import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#1A1A1A] border-t-4 border-[#F4D03F] py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-[#F4D03F] font-bold mb-4 text-lg">{t('about')}</h3>
            <p className="text-gray-300 text-sm">{t('description')}</p>
          </div>
          <div>
            <h3 className="text-[#F4D03F] font-bold mb-4 text-lg">{t('links')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-[#F4D03F]">{t('home')}</a></li>
              <li><a href="/gallery" className="hover:text-[#F4D03F]">{t('gallery')}</a></li>
              <li><a href="/dashboard" className="hover:text-[#F4D03F]">{t('dashboard')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#F4D03F] font-bold mb-4 text-lg">{t('language')}</h3>
            <LocaleSwitcher />
          </div>
        </div>
        <div className="border-t border-[#F4D03F] pt-4 text-center text-gray-400 text-sm">
          <p>&copy; 2026 dshit.xyz. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
