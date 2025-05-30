
import { EstudaiaNavbar } from '@/components/estudaia/Common/EstudaiaNavbar'
import { EstudaiaSignupForm } from '@/components/estudaia/Auth/EstudaiaSignupForm'

export default function EstudaiaSignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <EstudaiaNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
        <EstudaiaSignupForm />
      </div>
    </div>
  )
}
