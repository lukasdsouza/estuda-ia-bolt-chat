
import { EstudaiaNavbar } from '@/components/estudaia/Common/EstudaiaNavbar'
import { AdminDashboardEstudaia } from '@/components/estudaia/Admin/AdminDashboardEstudaia'

export default function EstudaiaAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <EstudaiaNavbar />
      <AdminDashboardEstudaia />
    </div>
  )
}
