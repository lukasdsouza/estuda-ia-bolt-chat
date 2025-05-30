
import { ChatInterfaceEstudaia } from './ChatInterfaceEstudaia'

export function EstudaiaStudentDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Aluno</h1>
        <p className="text-gray-600">Converse com o Estuda.ia para esclarecer suas dúvidas</p>
      </div>
      
      <ChatInterfaceEstudaia />
    </div>
  )
}
