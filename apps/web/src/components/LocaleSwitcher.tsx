'use client';

import { useLocale, usePathname, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = locales.find((l) => l.code === locale)?.label || 'English';

  // Get the path without locale prefix to allow switching languages
  // pathnam comes as /path (without locale prefix when used inside locale context)
  const handleLocaleSwitch = (newLocale: string) => {
    // Reconstruct URL with new locale
    return `/${newLocale}${pathname}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-[#F4D03F] transition-colors"
        aria-label={t('language')}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1M3 5h16m0 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5m0 0h.01M5 5h14"
          />
        </svg>
        <span>{currentLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#2D2D2D] rounded-lg shadow-lg border-2 border-[#F4D03F] z-50">
          {locales.map((l) => (
            <Link
              key={l.code}
              href={handleLocaleSwitch(l.code)}
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                l.code === locale
                  ? 'bg-[#F4D03F] text-[#1A1A1A]'
                  : 'text-white hover:bg-[#3D3D3D]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
