
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentEstudiaUser, signOutUser, type EstudaiaUser } from '@/services/supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: EstudaiaUser | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  isAdmin: boolean
  isStudent: boolean
  refetchUser: () => Promise<void>
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

  const fetchUser = async () => {
    try {
      const estudaiaUser = await getCurrentEstudiaUser()
      setUser(estudaiaUser)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
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
  }, [])

  const handleSignOut = async () => {
    await signOutUser()
    setUser(null)
    setSession(null)
  }

  const isAdmin = user?.profile?.role === 'admin'
  const isStudent = user?.profile?.role === 'student'

  const value = {
    user,
    session,
    loading,
    signOut: handleSignOut,
    isAdmin,
    isStudent,
    refetchUser: fetchUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
