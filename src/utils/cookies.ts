import { setCookie, parseCookies, destroyCookie } from 'nookies'
import type { GetServerSidePropsContext } from 'next'
import type { Credentials } from '@/lib/types/auth'

const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token'

// Set tokens as cookies
export function setCredentials(
  ctx: GetServerSidePropsContext | undefined = undefined,
  credentials: Credentials
) {
  const { access_token, refresh_token = '', expires_in, refresh_expires_in = 0 } = credentials

  setCookie(ctx, ACCESS_TOKEN_COOKIE_NAME, access_token, {
    path: '/',
    maxAge: expires_in,
    secure: process.env.NODE_ENV === 'production',
  })

  setCookie(ctx, REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
    path: '/',
    maxAge: refresh_expires_in,
    secure: process.env.NODE_ENV === 'production',
  })
}

// Parse tokens from cookies
export function parseCredentials(ctx: GetServerSidePropsContext | undefined = undefined) {
  const cookies = parseCookies(ctx)
  const accessToken = cookies[ACCESS_TOKEN_COOKIE_NAME]
  const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME]
  return { accessToken, refreshToken }
}

// Remove tokens from cookies
export function removeCredentials(ctx: GetServerSidePropsContext | undefined = undefined) {
  destroyCookie(ctx, ACCESS_TOKEN_COOKIE_NAME, { path: '/' })
  destroyCookie(ctx, REFRESH_TOKEN_COOKIE_NAME, { path: '/' })
}
