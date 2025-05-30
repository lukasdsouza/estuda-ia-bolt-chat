
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EstudaiaNavbar } from '@/components/estudaia/Common/EstudaiaNavbar'
import { useAuth } from '@/contexts/AuthContext'
import { Brain, BookOpen, Users, Zap } from 'lucide-react'

export default function EstudaiaHomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <EstudaiaNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Bem-vindo ao <span className="text-primary">Estuda.ia</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Sua plataforma de estudos inteligente com assistente de IA para aprendizado personalizado
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {user ? (
              <div className="space-x-4">
                <Link to="/estudaia/student">
                  <Button size="lg">Acessar Dashboard</Button>
                </Link>
                {user.profile.role === 'admin' && (
                  <Link to="/estudaia/admin">
                    <Button variant="outline" size="lg">Painel Admin</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/estudaia/signup">
                  <Button size="lg">Começar Agora</Button>
                </Link>
                <Link to="/estudaia/login">
                  <Button variant="outline" size="lg">Fazer Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary" />
                <CardTitle>Conteúdo Personalizado</CardTitle>
                <CardDescription>
                  IA treinada especificamente com o material das suas disciplinas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receba explicações e ajuda baseadas no conteúdo oficial dos seus cursos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary" />
                <CardTitle>Respostas Instantâneas</CardTitle>
                <CardDescription>
                  Tire suas dúvidas a qualquer momento com respostas rápidas e precisas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chat inteligente disponível 24/7 para apoiar seus estudos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary" />
                <CardTitle>Gestão Educacional</CardTitle>
                <CardDescription>
                  Professores podem gerenciar cursos e disciplinas facilmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Interface administrativa completa para organização do conteúdo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
