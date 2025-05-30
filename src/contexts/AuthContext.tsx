
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentEstudaiaUser, signOutUser, signInUser, signUpUser, type EstudaiaUser } from '@/services/supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: EstudaiaUser | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAdmin: boolean
  isStudent: boolean
  isAuthenticated: boolean
  refetchUser: () => Promise<void>
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EstudaiaUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const isSupabaseConfigured = !!supabase

  const fetchUser = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      return
    }

    try {
      const estudaiaUser = await getCurrentEstudaiaUser()
      setUser(estudaiaUser)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUser()
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session) {
          await fetchUser()
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isSupabaseConfigured])

  const handleSignOut = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não está configurado')
    }
    
    await signOutUser()
    setUser(null)
    setSession(null)
  }

  const handleLogin = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não está configurado')
    }

    try {
      const result = await signInUser(email, password)
      if (result.user) {
        await fetchUser()
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não está configurado')
    }

    try {
      const result = await signUpUser(email, password, name)
      if (result.user) {
        await fetchUser()
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const isAdmin = user?.profile?.role === 'admin'
  const isStudent = user?.profile?.role === 'student'
  const isAuthenticated = !!user && !!session && isSupabaseConfigured

  const value = {
    user,
    session,
    loading,
    signOut: handleSignOut,
    login: handleLogin,
    register: handleRegister,
    logout: handleSignOut,
    isAdmin,
    isStudent,
    isAuthenticated,
    refetchUser: fetchUser,
    isSupabaseConfigured
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
