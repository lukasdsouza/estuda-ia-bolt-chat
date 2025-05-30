
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentEstudiaUser, signOutUser, signInUser, signUpUser, type EstudaiaUser } from '@/services/supabase'
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

// Sistema de usuários mock para funcionamento sem Supabase
const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@estuda.ia',
    password: 'admin123',
    profile: {
      id: 'admin-1',
      role: 'admin' as const,
      full_name: 'Administrador',
      updated_at: new Date().toISOString()
    }
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EstudaiaUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const isSupabaseConfigured = !!supabase

  const fetchUser = async () => {
    if (!isSupabaseConfigured) {
      // Verificar se há usuário logado no localStorage
      const savedUser = localStorage.getItem('mockUser')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        } catch (error) {
          console.error('Erro ao carregar usuário do localStorage:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      return
    }

    try {
      const estudaiaUser = await getCurrentEstudiaUser()
      setUser(estudaiaUser)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      fetchUser()
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
      localStorage.removeItem('mockUser')
      setUser(null)
      setSession(null)
      return
    }
    
    await signOutUser()
    setUser(null)
    setSession(null)
  }

  const handleLogin = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Sistema mock de login
      const mockUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (mockUser) {
        const userData: EstudaiaUser = {
          id: mockUser.id,
          email: mockUser.email,
          profile: mockUser.profile,
          name: mockUser.profile.full_name,
          role: mockUser.profile.role
        }
        
        localStorage.setItem('mockUser', JSON.stringify(userData))
        setUser(userData)
        
        // Simular uma sessão mock
        const mockSession = {
          access_token: 'mock-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh',
          user: {
            id: mockUser.id,
            email: mockUser.email
          }
        } as any
        
        setSession(mockSession)
        return true
      }
      
      return false
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
      // Sistema mock de registro
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        return false // Email já existe
      }
      
      const newMockUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        profile: {
          id: `user-${Date.now()}`,
          role: 'student' as const,
          full_name: name,
          updated_at: new Date().toISOString()
        }
      }
      
      mockUsers.push(newMockUser)
      
      const userData: EstudaiaUser = {
        id: newMockUser.id,
        email: newMockUser.email,
        profile: newMockUser.profile,
        name: newMockUser.profile.full_name,
        role: newMockUser.profile.role
      }
      
      localStorage.setItem('mockUser', JSON.stringify(userData))
      setUser(userData)
      
      // Simular uma sessão mock
      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: {
          id: newMockUser.id,
          email: newMockUser.email
        }
      } as any
      
      setSession(mockSession)
      return true
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
  const isAuthenticated = !!user && (!!session || !isSupabaseConfigured)

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
