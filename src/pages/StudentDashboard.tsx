
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LogOut, MessageCircle, Brain, Book, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Curso, Disciplina } from '@/types';
import { storageUtils } from '@/utils/storage';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  useEffect(() => {
    setCursos(storageUtils.getCursos());
    setDisciplinas(storageUtils.getDisciplinas());
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2 mr-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Estuda.ia</h1>
                <p className="text-sm text-gray-600">Seu assistente de estudos com IA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Pronto para aprender? Use o Estuda.ia para tirar suas dúvidas e aprofundar seus conhecimentos.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/chat">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg">Conversar com Estuda.ia</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  Inicie uma conversa com seu assistente de IA para tirar dúvidas sobre suas matérias
                </p>
                <Button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  Começar Chat
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Book className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">Disciplinas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-2">{disciplinas.length}</p>
              <p className="text-gray-600 text-sm">
                {disciplinas.length === 1 ? 'disciplina cadastrada' : 'disciplinas cadastradas'} no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">Cursos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-purple-600 mb-2">{cursos.length}</p>
              <p className="text-gray-600 text-sm">
                {cursos.length === 1 ? 'curso disponível' : 'cursos disponíveis'} para estudo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Available Content */}
        {cursos.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Conteúdo Disponível</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {cursos.map((curso) => {
                const disciplinasDoCurso = storageUtils.getDisciplinasByCurso(curso.id);
                
                return (
                  <Card key={curso.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                        {curso.nome}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">
                        {curso.descricao || 'Sem descrição disponível'}
                      </p>
                      
                      {disciplinasDoCurso.length > 0 ? (
                        <div>
                          <p className="font-medium text-sm text-gray-700 mb-2">
                            Disciplinas ({disciplinasDoCurso.length}):
                          </p>
                          <div className="space-y-1">
                            {disciplinasDoCurso.map((disciplina) => (
                              <div key={disciplina.id} className="flex items-center text-sm text-gray-600">
                                <Book className="h-3 w-3 mr-2 text-gray-400" />
                                <span>{disciplina.nome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Nenhuma disciplina cadastrada ainda
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {cursos.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Nenhum conteúdo disponível ainda
            </h3>
            <p className="text-gray-500 mb-6">
              Os administradores ainda não cadastraram cursos e disciplinas no sistema.
            </p>
            <Link to="/chat">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ir para o Chat
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
