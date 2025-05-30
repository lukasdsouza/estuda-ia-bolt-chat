
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  role: 'student' | 'admin'
  full_name: string | null
  updated_at: string
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
  courses?: Course
}

export interface EstudaiaUser {
  id: string
  email: string
  profile: Profile
}

// Auth functions
export async function signUpUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  return { data, error }
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentEstudiaUser(): Promise<EstudaiaUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    id: user.id,
    email: user.email!,
    profile
  }
}

// Course CRUD
export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('nome')
  return { data, error }
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select()
    .single()
  return { data, error }
}

export async function updateCourse(id: string, course: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)
  return { error }
}

// Disciplina CRUD
export async function getDisciplinas() {
  const { data, error } = await supabase
    .from('disciplinas')
    .select(`
      *,
      courses (
        id,
        nome
      )
    `)
    .order('nome')
  return { data, error }
}

export async function createDisciplina(disciplina: Omit<Disciplina, 'id' | 'created_at' | 'courses'>) {
  const { data, error } = await supabase
    .from('disciplinas')
    .insert([disciplina])
    .select()
    .single()
  return { data, error }
}

export async function updateDisciplina(id: string, disciplina: Partial<Disciplina>) {
  const { data, error } = await supabase
    .from('disciplinas')
    .update(disciplina)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteDisciplina(id: string) {
  const { error } = await supabase
    .from('disciplinas')
    .delete()
    .eq('id', id)
  return { error }
}
