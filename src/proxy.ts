import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/core/i18n/config';

const intlMiddleware = createIntlMiddleware(routing);

const publicPagePaths = new Set([
  '/',
  '/blog',
  '/blog/what-is-automatic-speech-recognition',
  '/docs',
  '/pricing',
  '/privacy-policy',
  '/showcases',
  '/terms-of-service',
  '/updates',
]);

const authPagePaths = new Set([
  ...publicPagePaths,
  '/auth-callback',
  '/auth-popup',
  '/sign-in',
]);

const publicApiPrefixes = ['/api/docs/search'];
const authApiPrefixes = [
  ...publicApiPrefixes,
  '/api/auth',
  '/api/config/get-configs',
  '/api/user/get-user-info',
];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(locale as any);
  const pathWithoutLocale = isValidLocale
    ? pathname.slice(locale.length + 1)
    : pathname;
  const normalizedPath =
    pathWithoutLocale === ''
      ? '/'
      : pathWithoutLocale.length > 1
        ? pathWithoutLocale.replace(/\/$/, '')
        : pathWithoutLocale;

  const publicSiteOnly = process.env.PUBLIC_SITE_ONLY !== 'false';
  const isApi = pathname === '/api' || pathname.startsWith('/api/');
  const allowedPagePaths = publicSiteOnly ? publicPagePaths : authPagePaths;
  const allowedApiPrefixes = publicSiteOnly
    ? publicApiPrefixes
    : authApiPrefixes;
  const isAllowedApi = allowedApiPrefixes.some((prefix) =>
    matchesPrefix(pathname, prefix)
  );
  const isAllowedPage = allowedPagePaths.has(normalizedPath);

  if ((isApi && !isAllowedApi) || (!isApi && !isAllowedPage)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  if (isApi) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);

  intlResponse.headers.set('x-pathname', request.nextUrl.pathname);
  intlResponse.headers.set('x-url', request.url);

  const isAuthPage =
    normalizedPath === '/sign-in' ||
    normalizedPath === '/auth-popup' ||
    normalizedPath === '/auth-callback';

  if (isAuthPage) {
    intlResponse.headers.set('Cache-Control', 'private, no-store');
    intlResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else if (
    !pathWithoutLocale.startsWith('/admin') &&
    !pathWithoutLocale.startsWith('/settings') &&
    !pathWithoutLocale.startsWith('/activity') &&
    !pathWithoutLocale.startsWith('/sign-') &&
    !pathWithoutLocale.startsWith('/auth')
  ) {
    intlResponse.headers.delete('Set-Cookie');

    // Cache-Control header for public pages
    const cacheControl = 'public, s-maxage=3600, stale-while-revalidate=14400';

    intlResponse.headers.set('Cache-Control', cacheControl);
    intlResponse.headers.set('CDN-Cache-Control', cacheControl);
    intlResponse.headers.set('Cloudflare-CDN-Cache-Control', cacheControl);
  }

  return intlResponse;
}

export const config = {
  matcher: '/((?!trpc|_next|_vercel|.*\\..*).*)',
};
