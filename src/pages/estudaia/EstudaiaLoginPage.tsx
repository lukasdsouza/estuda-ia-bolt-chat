
import { EstudaiaNavbar } from '@/components/estudaia/Common/EstudaiaNavbar'
import { EstudaiaLoginForm } from '@/components/estudaia/Auth/EstudaiaLoginForm'

export default function EstudaiaLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <EstudaiaNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
        <EstudaiaLoginForm />
      </div>
    </div>
  )
}
