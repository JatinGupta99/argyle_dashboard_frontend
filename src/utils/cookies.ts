import { setCookie, parseCookies, destroyCookie } from 'nookies';
import type { GetServerSidePropsContext } from 'next';
import type { Credentials } from '@/lib/types/auth';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/constants/setting';
// Set tokens as cookies (secure, httpOnly)
export function setCredentials(ctx?: GetServerSidePropsContext, credentials?: Credentials) {
  if (!credentials) return;

  const {
    access_token,
    refresh_token = '',
    expires_in = 60 * 60, // fallback 1h
    refresh_expires_in = 60 * 60 * 24 * 30, // fallback 30d
  } = credentials;

  setCookie(ctx, ACCESS_TOKEN_COOKIE_NAME, access_token, {
    path: '/',
    maxAge: expires_in,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  setCookie(ctx, REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
    path: '/',
    maxAge: refresh_expires_in,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

// Read tokens from cookies
export function parseCredentials(ctx?: GetServerSidePropsContext) {
  const cookies = parseCookies(ctx);
  return {
    accessToken: cookies[ACCESS_TOKEN_COOKIE_NAME] || null,
    refreshToken: cookies[REFRESH_TOKEN_COOKIE_NAME] || null,
  };
}

// Remove tokens from cookies
export function removeCredentials(ctx?: GetServerSidePropsContext) {
  destroyCookie(ctx, ACCESS_TOKEN_COOKIE_NAME, { path: '/' });
  destroyCookie(ctx, REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
}
