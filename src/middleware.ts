import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/settings';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Simple parsing of Accept-Language header
  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale] = lang.split(';');
      return locale.trim().substring(0, 2).toLowerCase();
    });

  for (const locale of preferredLocales) {
    if (locales.includes(locale as typeof locales[number])) {
      return locale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Skip public assets, api requests, sitemap, robots, etc.
  const isAssetOrApi = 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // e.g. favicon.ico, sitemap.xml, robots.txt
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt';

  if (isAssetOrApi) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring "/_next" and "/api"
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};
