'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('header');

  return (
    <header className="bg-[#1A1A1A] border-b-4 border-[#F4D03F] py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-[#F4D03F] font-display">
          dshit.xyz
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/gallery" className="text-white hover:text-[#F4D03F] transition">
            {t('gallery')}
          </Link>
          <Link href="/dashboard" className="text-white hover:text-[#F4D03F] transition">
            {t('dashboard')}
          </Link>
          <Link href="/meme-creator" className="text-white hover:text-[#F4D03F] transition">
            {t('create')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
