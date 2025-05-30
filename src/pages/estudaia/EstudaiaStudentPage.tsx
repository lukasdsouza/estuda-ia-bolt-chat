
import { EstudaiaNavbar } from '@/components/estudaia/Common/EstudaiaNavbar'
import { EstudaiaStudentDashboard } from '@/components/estudaia/Student/EstudaiaStudentDashboard'

export default function EstudaiaStudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <EstudaiaNavbar />
      <EstudaiaStudentDashboard />
    </div>
  )
}
