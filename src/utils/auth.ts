import { setCredentials, parseCredentials, removeCredentials } from './cookies'
import type { Credentials } from '@/lib/types/auth'
import type { GetServerSidePropsContext } from 'next'

// Set auth token cookies
export function setAuthToken(credentials: Credentials, ctx?: GetServerSidePropsContext) {
  setCredentials(ctx, credentials)
}

// Get auth tokens from cookies
export function getAuthToken(ctx?: GetServerSidePropsContext) {
  return parseCredentials(ctx)
}

// Clear auth tokens from cookies
export function clearAuthToken(ctx?: GetServerSidePropsContext) {
  removeCredentials(ctx)
}
