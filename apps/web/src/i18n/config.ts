import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'es', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Configure next-intl
export default getRequestConfig(async ({ locale }) => {
  // Validate locale and cast to Locale type
  const validLocale: Locale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  return {
    locale: validLocale,
    messages: (
      await import(`./locales/${validLocale}.json`)
    ).default,
    timeZone: 'UTC',
    now: new Date(),
  };
});
