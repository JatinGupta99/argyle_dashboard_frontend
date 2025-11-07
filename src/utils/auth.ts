import { setCredentials, parseCredentials, removeCredentials } from './cookies';
import type { Credentials } from '@/lib/types/auth';
import type { GetServerSidePropsContext } from 'next';

export function setAuthToken(credentials: Credentials, ctx?: GetServerSidePropsContext) {
  setCredentials(ctx, credentials);
}

export function getAuthToken(ctx?: GetServerSidePropsContext) {
  return parseCredentials(ctx);
}

export function clearAuthToken(ctx?: GetServerSidePropsContext) {
  removeCredentials(ctx);
}
