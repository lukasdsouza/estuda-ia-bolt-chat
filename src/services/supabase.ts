import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your configuration.')
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
}

// Create a mock client or null if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface EstudaiaProfile {
  id: string
  role: 'student' | 'admin'
  full_name: string | null
  updated_at: string
}

export interface EstudaiaUser {
  id: string
  email: string
  profile: EstudaiaProfile
  name?: string // For backward compatibility
  role?: 'student' | 'admin' // For backward compatibility
}

export interface Course {
  id: string
  nome: string
  descricao: string | null
  created_at: string
}

export interface Disciplina {
  id: string
  nome: string
  curso_id: string
  google_drive_folder_id: string
  descricao_breve: string | null
  created_at: string
}

// Auth functions with null checks
export async function signUpUser(email: string, password: string, fullName: string) {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signInUser(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOutUser() {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentEstudiaUser(): Promise<EstudaiaUser | null> {
  if (!supabase) {
    console.warn('Supabase não está configurado. Retornando null.')
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error || !profile) {
    // If no profile exists, create a default one
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        role: 'student',
        full_name: user.user_metadata?.full_name || null
      })
      .select()
      .single()
    
    if (createError) throw createError
    
    return {
      id: user.id,
      email: user.email!,
      profile: newProfile,
      name: newProfile.full_name,
      role: newProfile.role
    }
  }
  
  return {
    id: user.id,
    email: user.email!,
    profile,
    name: profile.full_name,
    role: profile.role
  }
}

// Course CRUD functions with null checks
export async function getCourses(): Promise<Course[]> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateCourse(id: string, course: Partial<Omit<Course, 'id' | 'created_at'>>): Promise<Course> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteCourse(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Disciplina CRUD functions with null checks
export async function getDisciplinas(): Promise<Disciplina[]> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createDisciplina(disciplina: Omit<Disciplina, 'id' | 'created_at'>): Promise<Disciplina> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase
    .from('disciplinas')
    .insert(disciplina)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateDisciplina(id: string, disciplina: Partial<Omit<Disciplina, 'id' | 'created_at'>>): Promise<Disciplina> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { data, error } = await supabase
    .from('disciplinas')
    .update(disciplina)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteDisciplina(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.')
  }
  
  const { error } = await supabase
    .from('disciplinas')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
