import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'es', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Configure next-intl
export default getRequestConfig(async ({ locale: currentLocale }) => ({
  locale: currentLocale || defaultLocale,
  messages: (
    await import(`./locales/${currentLocale || defaultLocale}.json`)
  ).default,
  timeZone: 'UTC',
  now: new Date(),
}));
