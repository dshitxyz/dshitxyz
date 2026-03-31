import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  matcher: [
    '/',
    '/(es|fr|de|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
