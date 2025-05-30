
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LogOut, Book, GraduationCap, Plus } from 'lucide-react';
import { Curso, Disciplina } from '@/types';
import { storageUtils } from '@/utils/storage';
import CursoForm from '@/components/CursoForm';
import DisciplinaForm from '@/components/DisciplinaForm';
import CursosList from '@/components/CursosList';
import DisciplinasList from '@/components/DisciplinasList';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [showCursoForm, setShowCursoForm] = useState(false);
  const [showDisciplinaForm, setShowDisciplinaForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCursos(storageUtils.getCursos());
    setDisciplinas(storageUtils.getDisciplinas());
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleSaveCurso = (curso: Curso) => {
    storageUtils.saveCurso(curso);
    loadData();
    setShowCursoForm(false);
    setEditingCurso(null);
    toast({
      title: "Curso salvo",
      description: `Curso "${curso.nome}" foi ${editingCurso ? 'atualizado' : 'criado'} com sucesso!`,
    });
  };

  const handleDeleteCurso = (id: string) => {
    const curso = cursos.find(c => c.id === id);
    storageUtils.deleteCurso(id);
    loadData();
    toast({
      title: "Curso excluído",
      description: `Curso "${curso?.nome}" foi excluído com sucesso!`,
    });
  };

  const handleSaveDisciplina = (disciplina: Disciplina) => {
    storageUtils.saveDisciplina(disciplina);
    loadData();
    setShowDisciplinaForm(false);
    setEditingDisciplina(null);
    toast({
      title: "Disciplina salva",
      description: `Disciplina "${disciplina.nome}" foi ${editingDisciplina ? 'atualizada' : 'criada'} com sucesso!`,
    });
  };

  const handleDeleteDisciplina = (id: string) => {
    const disciplina = disciplinas.find(d => d.id === id);
    storageUtils.deleteDisciplina(id);
    loadData();
    toast({
      title: "Disciplina excluída",
      description: `Disciplina "${disciplina?.nome}" foi excluída com sucesso!`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Estuda.ia - Admin</h1>
                <p className="text-sm text-gray-600">Painel de Administração</p>
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
        <Tabs defaultValue="cursos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="cursos">Cursos</TabsTrigger>
            <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          </TabsList>

          <TabsContent value="cursos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Book className="h-5 w-5 mr-2 text-blue-600" />
                    <CardTitle>Gerenciar Cursos</CardTitle>
                  </div>
                  <Button 
                    onClick={() => setShowCursoForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Curso
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showCursoForm && (
                  <div className="mb-6">
                    <CursoForm
                      curso={editingCurso}
                      onSave={handleSaveCurso}
                      onCancel={() => {
                        setShowCursoForm(false);
                        setEditingCurso(null);
                      }}
                    />
                  </div>
                )}
                <CursosList
                  cursos={cursos}
                  onEdit={(curso) => {
                    setEditingCurso(curso);
                    setShowCursoForm(true);
                  }}
                  onDelete={handleDeleteCurso}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disciplinas" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Book className="h-5 w-5 mr-2 text-indigo-600" />
                    <CardTitle>Gerenciar Disciplinas</CardTitle>
                  </div>
                  <Button 
                    onClick={() => setShowDisciplinaForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={cursos.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Disciplina
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cursos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Crie pelo menos um curso antes de adicionar disciplinas.</p>
                  </div>
                ) : (
                  <>
                    {showDisciplinaForm && (
                      <div className="mb-6">
                        <DisciplinaForm
                          disciplina={editingDisciplina}
                          cursos={cursos}
                          onSave={handleSaveDisciplina}
                          onCancel={() => {
                            setShowDisciplinaForm(false);
                            setEditingDisciplina(null);
                          }}
                        />
                      </div>
                    )}
                    <DisciplinasList
                      disciplinas={disciplinas}
                      cursos={cursos}
                      onEdit={(disciplina) => {
                        setEditingDisciplina(disciplina);
                        setShowDisciplinaForm(true);
                      }}
                      onDelete={handleDeleteDisciplina}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
