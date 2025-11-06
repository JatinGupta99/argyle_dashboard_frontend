'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthService } from '@/services/auth.service'
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/auth'
import type { UserProfile } from '@/lib/types/auth'

type AuthContextType = {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const router = useRouter()

  // On mount, check for token and fetch profile
  useEffect(() => {
    const { accessToken } = getAuthToken()
    if (!accessToken) {
      setUser(null)
      return
    }
    if (!user) {
      AuthService.getProfile()
        .then(profile => setUser(profile))
        .catch(() => {
          clearAuthToken()
          setUser(null)
          router.push('/auth/login')
        })
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password })
    const { access_token, expires_in } = response.data

    // Set token in cookie (via utility)
    setAuthToken({
      access_token,
      refresh_token: '',
      expires_in,
      refresh_expires_in: 0,
      token_type: 'Bearer',
      session_state: '',
    })

    // Fetch and set user profile separately
    const profile = await AuthService.getProfile()
    setUser(profile)

    router.push('/dashboard')
  }

  const logout = async () => {
    await AuthService.logout()
    clearAuthToken()
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
