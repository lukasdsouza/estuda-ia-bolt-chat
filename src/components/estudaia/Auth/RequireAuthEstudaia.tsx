
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

interface RequireAuthEstudaiaProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function RequireAuthEstudaia({ children, adminOnly = false }: RequireAuthEstudaiaProps) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/estudaia/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/estudaia/student" replace />
  }

  return <>{children}</>
}
