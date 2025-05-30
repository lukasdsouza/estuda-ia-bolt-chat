
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Book, Edit, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { getCourses, getDisciplinas, deleteCourse, deleteDisciplina, type Course, type Disciplina } from '@/services/supabase'
import { CourseFormEstudaia } from './CourseFormEstudaia'
import { DisciplineFormEstudaia } from './DisciplineFormEstudaia'

export function AdminDashboardEstudaia() {
  const [courses, setCourses] = useState<Course[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [loading, setLoading] = useState(true)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showDisciplineForm, setShowDisciplineForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingDiscipline, setEditingDiscipline] = useState<Disciplina | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesData, disciplinasData] = await Promise.all([
        getCourses(),
        getDisciplinas()
      ])
      setCourses(coursesData)
      setDisciplinas(disciplinasData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id)
      await loadData()
      toast({
        title: 'Sucesso',
        description: 'Curso excluído com sucesso'
      })
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir curso',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteDiscipline = async (id: string) => {
    try {
      await deleteDisciplina(id)
      await loadData()
      toast({
        title: 'Sucesso',
        description: 'Disciplina excluída com sucesso'
      })
    } catch (error) {
      console.error('Error deleting discipline:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir disciplina',
        variant: 'destructive'
      })
    }
  }

  const handleCourseFormClose = () => {
    setShowCourseForm(false)
    setEditingCourse(null)
    loadData()
  }

  const handleDisciplineFormClose = () => {
    setShowDisciplineForm(false)
    setEditingDiscipline(null)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie cursos e disciplinas do sistema</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="disciplines">Disciplinas</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Book className="h-5 w-5 mr-2 text-blue-600" />
                  <CardTitle>Gerenciar Cursos</CardTitle>
                </div>
                <Button onClick={() => setShowCourseForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Curso
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showCourseForm && (
                <div className="mb-6">
                  <CourseFormEstudaia
                    course={editingCourse}
                    onClose={handleCourseFormClose}
                  />
                </div>
              )}
              
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{course.nome}</h3>
                        <p className="text-gray-600 text-sm mt-1">{course.descricao || 'Sem descrição'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCourse(course)
                            setShowCourseForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {courses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Nenhum curso cadastrado ainda.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplines" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Book className="h-5 w-5 mr-2 text-indigo-600" />
                  <CardTitle>Gerenciar Disciplinas</CardTitle>
                </div>
                <Button
                  onClick={() => setShowDisciplineForm(true)}
                  disabled={courses.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Disciplina
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Crie pelo menos um curso antes de adicionar disciplinas.</p>
                </div>
              ) : (
                <>
                  {showDisciplineForm && (
                    <div className="mb-6">
                      <DisciplineFormEstudaia
                        discipline={editingDiscipline}
                        courses={courses}
                        onClose={handleDisciplineFormClose}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {disciplinas.map((disciplina) => {
                      const course = courses.find(c => c.id === disciplina.curso_id)
                      return (
                        <div key={disciplina.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{disciplina.nome}</h3>
                              <p className="text-gray-600 text-sm mt-1">
                                Curso: {course?.nome || 'Curso não encontrado'}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {disciplina.descricao_breve || 'Sem descrição'}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                Google Drive ID: {disciplina.google_drive_folder_id}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingDiscipline(disciplina)
                                  setShowDisciplineForm(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDiscipline(disciplina.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {disciplinas.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Nenhuma disciplina cadastrada ainda.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
